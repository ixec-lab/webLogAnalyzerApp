from flask import render_template, request, make_response, session, redirect
from werkzeug.utils import secure_filename
from App import app
import json
import os
import model
from html import escape

@app.route('/login')
def login():
   if  not 'username' in session:
    return render_template('login.html')
   else:
      return redirect('/dashboard', 302)
   

@app.route('/dashboard')
def dashboard():
   if 'username' in session:
      return render_template('dashboard.html')
   else:
      return redirect('/login', 302)
   

@app.route('/dashboard/results')
def results():
   if 'username' in session:
      return render_template('results.html')
   else:
      return redirect('/dashboard', 302)

@app.route('/dashboard/anomaly')
def anomaly():
   if 'username' in session:
      return render_template('anomaly.html')
   else:
      return redirect('/dashboard', 302)

@app.route('/dashboard/status')
def status():
   if 'username' in session:
      return render_template('stat.html')
   else:
      return redirect('/dashboard', 302)

@app.route('/logout')
def logout():
   if 'username' in session:
      session.pop('username')
      return redirect('/login', 302)
   else:
      return redirect('/login', 302)

@app.route('/api/upload', methods=['POST'])
def api_upload_log():
   errors = list()
   if request.method == 'POST':
    file = request.files['log']
    fileParts = file.filename.split('.')
    ext = fileParts[-1]
    if len(fileParts) > 2:
        errors.append("Double extension detected")
    if ext not in ['txt','log']:
      errors.append("Only .txt and .log are allowed")
    
    if len(errors) == 0:
            file.save("uploads/"+secure_filename(file.filename))
            data = {"success": True, "message": "File uploaded successfully"}
            res =  make_response(json.dumps(data))
            return res
    else:
            data = {"success": False, "message": "File not supported"}
            res =  make_response(json.dumps(data))
            return res
    
@app.route('/api/login', methods=['POST'])
def api_login():
    allowed_user = {'username': 'admin', 'password': 'admin'} # TODO: creating a database to do more securly the steps

    if request.method == 'POST':
        req_username = request.form['username']
        req_password = request.form['password']

        if allowed_user.get('username') == req_username and allowed_user.get('password') == req_password:
            data = {"success": True, "message": "Success !"}
            session['username'] = req_username
        else:
            data = {"success": False, "message": "username or password invalid"}
        
        res = make_response(json.dumps(data))
        return res
    
@app.route('/api/uploadedFiles')
def listFiles():
   if 'username' in session:
      files = os.listdir('uploads/')
      data = {"success": True, "logs": files}
      res = make_response(json.dumps(data))
      return res
   
@app.route('/api/ia/predictions/stats/<filename>')
def stats(filename):
   res = api_predict_from_log(filename)
   #print(res.response[0])
   prediction_stats = {'SQLI': 0, 'NORMAL': 0, 'XSS': 0, 'CMDINJ': 0, 'LFI': 0}
   
   for line in json.loads(res.response[0])['predictions']:
      if line['prediction'] == 'SQLI':
         prediction_stats['SQLI'] += 1
      if line['prediction'] == 'NORMAL':
         prediction_stats['NORMAL'] += 1
      if line['prediction'] == 'XSS':
         prediction_stats['XSS'] +=1
      if line['prediction'] == 'CMDINJ':
         prediction_stats['CMDINJ'] +=1
      if line['prediction'] == 'LFI':
         prediction_stats['LFI'] +=1

      data = {'success': True, 'stats': prediction_stats}
   
   res = make_response(json.dumps(data))
   return res
         
    
@app.route('/api/ia/prediction/<filename>', methods=['GET'])
def api_predict_from_log(filename):
   if 'username' in session:
      log_filename = filename

      LOG_DIR = 'uploads/'

      logFiles = os.listdir(LOG_DIR)

      if log_filename in logFiles:
      
         parsedLog = model.logParser(LOG_DIR+log_filename)
         log_df = model.log2dataframe(parsedLog)
         log_df = model.replace_val(log_df,'-', 0)
         log_df = model.convert_val(log_df,'response_size',int)
         log_df = model.drop_columns(log_df,['ip','someVar','user', 'protocol', 'refrer'])
         log_df = model.url_decode(log_df,'url')
         lof_df = model.normalize(log_df)
         log_df = model.url_lowercase(log_df,'decoded_url')
         tfidf_df = model.tfidfCalculator(log_df)
         # model invocation

         ia = model.invokModel(secure_filename("tfidf-rfc-test"))
         #ia = model.invokModel(secure_filename("testModel"))

         # preparing entry matrix to the trained model
         enrty_matrix = model.model_matrix(log_df,ia,tfidf_df)

         predictions = ia.predict(enrty_matrix)

         labels = {"SQLI": 2.0, "XSS": 4.0, "LFI": 1.0, "CMDINJ": 0.0, "NORMAL": 3.0}
         labled_predictions = list()
         logs = list()
         for p in predictions:
            for i in labels.keys():
               if p == labels[i]:
                     labled_predictions.append(i)

         for i in range(0,len(log_df)):
            log = {}

            log['id'] = i+1
            log['date'] = log_df['date'][i]
            log['url'] = escape(log_df['decoded_url'][i])
            log['user_agent'] = escape(log_df['user_agent'][i])
            log['prediction'] = labled_predictions[i]

            logs.append(log)

         data = {"success": True, "predictions": logs}

         res = make_response(json.dumps(data))
         res.headers["Content-Type"] = "application/json"
         return res
      else:
         data = {"success": False, "message": "Please provide the name of your uploaded log"}
         res = make_response(json.dumps(data))
         return res
   else:
      data = {"success": False, "message": "Your are not authorized to use this service, please contact your administrator."}
      return make_response(json.dumps(data))