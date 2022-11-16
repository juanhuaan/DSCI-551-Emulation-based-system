from django.shortcuts import render
from django.http import HttpResponse
import pyrebase

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


def index(request):
    filename = 'cars'

    data = {"cars3": 3}
    database.set(data)

    userdata = {"root":
                {"user":
                 {"John":
                  {"cars":
                   {"p1": "https://edfs-b732d-default-rtdb.firebaseio.com/data/cars1",
                    "p2": "https://edfs-b732d-default-rtdb.firebaseio.com/data/cars2"}}}}}
    database.set(userdata)

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
