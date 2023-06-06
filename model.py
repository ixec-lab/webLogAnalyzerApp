from parse import parse
import pandas as pd
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
import joblib
from urllib.parse import unquote


def selectLog(path):
    LOG_DIR = 'uploads/'

    logFile = os.listdir(LOG_DIR)

def logParser(log):
    template = '{ip} {someVar} {user} {date} "{method} {url} {protocol}" {status_code} {response_size} "{refrer}" "{user_agent}"'

    logl = open(log,'r') # Fichier log à parser

    parsed_logs = []
    errordLine = []

    for line in logl.readlines():
        line = line.replace("\n","")
        parsed = parse(template, line)
        if parsed is not None:
            parsed_logs.append(parsed.named)
        else:
            errordLine.append(line)

    return parsed_logs

def log2dataframe(logs: list):
    return pd.DataFrame(logs)

def emptyDataFrame(rows,cols):
    return pd.DataFrame(0, index=range(rows), columns=list(cols))

def replace_val(df,target,word):
    df['response_size'] = df['response_size'].replace(target, word)

    return df

def normalize(df):
    scaler = MinMaxScaler(feature_range=(0, 1))
    df['response_size'] = scaler.fit_transform(df[['response_size']])

    return df

def convert_val(df,column,type):
    df = df.astype({column: type})

    return df

def drop_columns(df,columns: list):
    df = df.drop(columns=columns)

    return df

def url_decode(df,column):
    df['decoded_url'] = df[column].apply(unquote)

    return df

def url_lowercase(df,column):
    df[column] = df[column].apply(lambda x: x.lower())

    return df


def tokenize(text):
    #tokens = re.findall(r'add|all|alter|and|as|asc|between|by|case|check|column|constraint|create|database|default|delete|desc|distinct|drop|else|end|sleep|escape|except|exec|exists|fetch|from|for|foreign|full|group|having|if|in|index|inner|insert|into|is|join|key|left|like|limit|not|null|on|or|order|outer|primary|references|right|select|set|table|then|top|truncate|union|unique|update|values|view|where|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|<!DOCTYPE>|<html>|<head>|<title>|<body>|<h1>|<h2>|<h3>|<h4>|<h5>|<h6>|<p>|<a>|<img>|img|<img/>|<ul>|<ol>|<li>|<table>|<tr>|<th>|<td>|<form>|<input>|<select>|<option>|<textarea>|<button>|<label>|<br>|<hr>|<div>|<span>|<nav>|<header>|<footer>|<main>|<section>|<article>|<aside>|<style>|<script>|<meta>|<link>|document.cookie|<base>|alias|cd|chmod|chown|clear|cp|curl|df|du|echo|exit|find|grep|head|history|kill|less|ln|ls|man|mkdir|more|mv|nano|netstat|ping|ps|pwd|rm|rmdir|scp|service|ssh|su|sudo|tail|tar|top|touch|uname|unzip|vi|vim|whoami|yum|zip|etc/passwd|\*|,|admin\"--|admin\'--|1=1|1=1--|1=1#|[09]+=[09]+|admin\'|admin"|\.|;|\(|\)|\[|\]|=|>|<|!|\||&|-|\+|%|^|#|/\*|\*/|--|-- -|//|==|===|!=|!==|>=|<=|&&|\|\||~|../|%00|%0a|:|{|}|`|\$|@|"|\'|\\|_', text)
    tokens = re.findall(r'\b(add|all|alter|and|as|asc|between|by|case|check|column|constraint|boot.ini|create|database|default|delete|desc|distinct|drop|else|end|sleep|escape|except|exec|exists|fetch|from|for|foreign|full|group|having|if|in|index|inner|insert|into|is|join|key|left|like|limit|not|null|on|or|order|outer|primary|references|right|select|set|table|then|top|truncate|union|unique|update|values|view|where|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|<!DOCTYPE>|<html>|<head>|<title>|<body>|<h1>|<h2>|<h3>|<h4>|<h5>|<h6>|<p>|<a>|<img>|<ul>|<ol>|<li>|<table>|<tr>|<th>|<td>|<form>|<input>|<select>|<option>|<textarea>|<button>|<label>|<br>|<hr>|<div>|<span>|<nav>|<header>|<footer>|<main>|<section>|<article>|<aside>|<style>|<script>|<meta>|<link>|document.cookie|<base>|alias|cd|chmod|chown|clear|cp|curl|df|du|echo|exit|find|grep|head|history|kill|less|ln|ls|man|mkdir|more|mv|nano|netstat|ping|ps|pwd|rm|rmdir|scp|service|ssh|su|sudo|tail|tar|top|touch|uname|unzip|vi|vim|whoami|yum|zip|etc/passwd|etc/hosts|admin\'|admin"|\*|,|\.|;|\(|\)|\[|\]|=|>|<|!|\||&|-|\+|%|^|#|\/\*|\*\/|--|-- -|\/\/|==|===|!=|!==|>=|<=|&&|\\|~|\.\.\/|%00|%0a|<<|>>|:|{|}|`|\$|@|"|\'|\\|_)\b', text) #best
    return tokens

def invokModel(modelName):
   PATH = "models/{}.joblib".format(modelName)
   return joblib.load(PATH)

def model_matrix(log_df,model,tfidf):
   rows = len(tfidf)
   cols = list(model.feature_names_in_)
   enrty_matrix = pd.DataFrame(0, index=range(rows), columns=cols)
   data_cols = tfidf.columns.tolist()
   
   # filtring features to get trained features
   for col in data_cols:
        for ft in cols:
            if col == ft:
                enrty_matrix[col] = tfidf[col]

    # update the response_size
   enrty_matrix['response_size'] = log_df['response_size']
   return enrty_matrix
   
def tfidfCalculator(df):
    vectorizer = TfidfVectorizer(stop_words=None,tokenizer=tokenize)
    vectorizer.fit(df['decoded_url'].tolist())
    X = vectorizer.transform(df['decoded_url'].tolist())
    ## Convertir la matrice sparse résultante en un DataFrame
    a = pd.DataFrame(X.toarray(), columns=vectorizer.get_feature_names_out())

    return a