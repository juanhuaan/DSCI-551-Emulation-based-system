from django.shortcuts import render
from django.http import HttpResponse
import pyrebase
import csv
import json
import pandas as pd

# Create your views here.

# For Firebase JS SDK v7.20.0 and later, measurementId is optional
Config = {
    "apiKey": "AIzaSyDzbaYF7sqQUhS8fU8m4PZM3RlnK83H4L8",
    "authDomain": "edfs-b732d.firebaseapp.com",
    "databaseURL": "https://edfs-b732d-default-rtdb.firebaseio.com",
    "projectId": "edfs-b732d",
    "storageBucket": "edfs-b732d.appspot.com",
    "messagingSenderId": "277169660583",
    "appId": "1:277169660583:web:541cb7dba76f84d0afb182",
    "measurementId": "G-STBE45S793"
}

firebase = pyrebase.initialize_app(Config)
authe = firebase.auth()
database = firebase.database()

# initialize the data to store json objects
review_data = {}
user_data = {}
population_data = {}
restaurant_data = {}

# file paths
review = './dataSet/export_review.csv'
user = './dataSet/export_user.csv'
population = './dataSet/population.csv'
restaurant = './dataSet/searchRest.csv'


def make_json(csvFilePath, data, k, jsonFilePath):  # convert csv to json object

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary
        # and add it to data
        for rows in csvReader:

            # Assuming a column named 'No' to
            # be the primary key
            key = rows[k]
            data[key] = rows

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


def index(request):  # run when brower refreshed

    data = {"cars3": 3}
    database.set(data)

    userdata = {"root":
                {"user":
                 {"John":
                  {"cars":
                   {"p1": "https://edfs-b732d-default-rtdb.firebaseio.com/data/cars1",
                    "p2": "https://edfs-b732d-default-rtdb.firebaseio.com/data/cars2"}}}}}
    database.set(userdata)

    # upload review data
    make_json(review, review_data, 'uid', './dataSet/export_review.json')
    if (database.child("review").get().val() == None):
        database.child("review").set(review_data)

    # upload user data
    make_json(user, user_data, 'uid', './dataSet/export_user.json')
    if (database.child("user").get().val() == None):
        database.child("user").set(user_data)

    # upload population data
    make_json(population, population_data, 'Rank', './dataSet/population.json')
    if (database.child("population").get().val() == None):
        database.child("population").set(population_data)

    # upload restaurant data
    make_json(restaurant, restaurant_data,
              'business id', './dataSet/serchRest.json')
    if (database.child("restaurant").get().val() == None):
        database.child("restaurant").set(restaurant_data)

    filename = 'cars'
    partition1 = database.child("data").child("cars1").get().key()
    part1_location = database.child('root').child('user').child(
        'John').child('cars').child('p1').get()
    value = part1_location.val()

    context = {
        'filename': filename,
        'partition1': partition1,
        'part1_location': value
    }
    return render(request, 'index.html', context)
