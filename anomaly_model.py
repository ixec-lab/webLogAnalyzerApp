from parse import parse
import pandas as pd 
from sklearn.preprocessing import OrdinalEncoder
from sklearn.preprocessing import MinMaxScaler
from urllib.parse import unquote
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import VarianceThreshold
import joblib


def delete_last_lines(filename, x):
    with open(filename, 'r') as file:
        lines = file.readlines()

    num_lines = len(lines)
    if x >= num_lines:
        # If x is greater than or equal to the total number of lines,
        # the entire file will be deleted
        lines = []
    else:
        lines = lines[:-x]  # Exclude the last x lines

    with open(filename, 'w') as file:
        file.writelines(lines)

def copy_file_content(source_file, destination_file):
    with open(source_file, 'r') as source:
        source_content = source.read()

    with open(destination_file, 'a') as destination:
        destination.write(source_content)

def clustring():
    
    template = '{ip} {someVar} {user} [{date}] "{method} {url} {protocol}" {status_code} {response_size} "{referer}" "{user_agent}" ({label})'
    templateError = '{ip} {someVar} {user} [{date}] "{method} {url} {protocol}" {status_code} {response_size} "{referer}" "{user_agent}"'
    
    logl = open('local_logs/newDataSetForUnSuperVised.txt','r') # Fichier log à parser

    parsed_logs = []
    new_logs = []
    for line in logl.readlines():
        line = line.replace("\n","")
        parsed = parse(template, line)
        if parsed is not None:
            parsed_logs.append(parsed.named)
        else:
            parsed = parse(templateError, line)
            if parsed is not None:
                new_logs.append(parsed.named)
                parsed_logs.append(parsed.named)
            else:
                print(line)
    logl.close()

    log_df1 = pd.DataFrame(parsed_logs)


    # # Convert the column 'response_size' to int mais avant de convertir il faut remplacer toute valeur vide '-' par '0', pour ne pas avoir l'erreur de conversion de '-' vers un entier

    #log_df1 = log_df1.drop('label',axis=1)

    print(log_df1)

    # # Remplacer toute valeur vide '-' par '0'
    log_df1['response_size'] = log_df1['response_size'].replace('-', '0')

    # # Convertir la colonne 'response_size' en type entier
    log_df1=log_df1.astype({'response_size': int})



    # ## Sauvegardez le DataFrame dans un fichier CSV :
    # log_df1.to_csv('parsed_logs.csv', index=False)


    log_df1 =log_df1.drop(columns=['ip', 'someVar','user', 'date', 'protocol', 'referer'])

    # # Instancier un encodeur ordinal
    encoder = OrdinalEncoder()

    # # Encoder les colonnes "method", "status code" et "label"
    log_df1[['method', 'status_code']] = encoder.fit_transform(log_df1[['method', 'status_code']])


    nouvelle_df1 = log_df1.loc[:, ['status_code', 'response_size']]
    #nouvelle_df = log_df.loc[:, ['response_size']]

    # # Scale the 'response_size' column
    scaler = MinMaxScaler(feature_range=(0, 1))
    nouvelle_df1['response_size'] = scaler.fit_transform(nouvelle_df1[['response_size']])

    # deocde url for better detection
    log_df1['decoded_url'] = log_df1['url'].apply(unquote)

    # # Prétraitement des données
    log_df1['decoded_url'] = log_df1['decoded_url'].str.lower()

    # # Initialiser le vectoriseur TF-IDF
    # #vectorizer = TfidfVectorizer(token_pattern=r'[^/\s]+') ## chaque mot entre les délimiteurs '/' et ' ' sera considéré comme un token distinct
    vectorizer = TfidfVectorizer()
    # # Appliquer le vectoriseur TF-IDF sur les données de decoded_url
    vectorizer.fit(log_df1['decoded_url'].tolist())
    X = vectorizer.transform(log_df1['decoded_url'].tolist())

    # # Créer un DataFrame à partir de la matrice TF-IDF
    tfidf_df1 = pd.DataFrame(X.toarray(), columns=vectorizer.get_feature_names_out())

    # # Create VarianceThreshold object
    selector = VarianceThreshold(threshold=0.0001)

    # # Fit and transform the data
    tfidf_df1_selected_features = selector.fit_transform(tfidf_df1)

    # # Get the support mask (boolean values indicating selected features)
    mask = selector.get_support()

    # # Print the selected features
    selected_features = [index for index, boolean in enumerate(mask) if boolean]

    new_features = list()
    for i in selected_features:
        new_features.append(tfidf_df1.columns.tolist()[i])


    cols = new_features
    rows = len(tfidf_df1)

    selected_features = pd.DataFrame(0, index=range(rows), columns=cols)


    for col in cols:
        for ft in tfidf_df1.columns.tolist():
            if col == ft:
                selected_features[col] = tfidf_df1[col]


    result = pd.concat([nouvelle_df1, selected_features], axis=1)


    # # deserialization of medel
    saved_model = joblib.load('models/anomaly.joblib')

    # print(saved_model.get_params)

    # # rows = len(selected_features)
    # # cols = list(saved_model.feature_names_in_)
    # # data_cols = tfidf_df1.columns.tolist()

    # # # create an empty dataframe with 0 

    # # enrty_matrix = pd.DataFrame(0, index=range(rows), columns=cols)


    # # # intersection between the model feautres with data features

    # # for col in data_cols:
    # #   for ft in cols:
    # #     if col == ft:
    # #       enrty_matrix[col] = tfidf_df1[col]



    # # enrty_matrix['status_code'] = nouvelle_df1['status_code']
    # # enrty_matrix['response_size'] = nouvelle_df1['response_size']

    # # print(enrty_matrix)
    # print(saved_model.labels_)
    # print(saved_model.core_sample_indices_)
    clusters = saved_model.fit_predict(result)
    delete_last_lines('local_logs/newDataSetForUnSuperVised.txt',len(new_logs))
    return clusters[-len(new_logs):]
    # print(len(predictions[0:28]))
    # print(predictions[0:28])
