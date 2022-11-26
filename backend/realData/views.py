from django.shortcuts import render
from .models import City0, City1, City2, Rest1, Rest2, Rest0, User0, User1,User2, Rate0, Rate1, Rate2
from django.contrib import admin
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import RestaurantSpecsSerializer,CitySpecsSerializer,UserSpecsSerializer,RateSpecsSerializer
import pandas as pd
from http import HTTPStatus
import json
from django.db.models import Max

# Create your views here.

class AllView(APIView):

    dict = {}
    k = 3
    
    """
    get_queries
    Descriptions: get all the information in certain partition table
    input: table name(such as Rest0, Rest1...)
    return: json object of table information
            _type_: json object
    """
    def get_queries(self, Rest):
        restaurants = Rest.objects.all();
        return restaurants;
   
    """
    is_valid_primary_id
    Descriptions: check is the primary key is unique in table
    input: primary key value -> Id
    return: Boolean
    """
    def is_valid_primary_id(self, id, Rest):
        if Rest.objects.filter(pk = id).exists():
            return False
        return True


    """
    Method: DELETE
    URL: localhost:8000/api/restaurants/
    
    Description
    delete all the partitions in certain table for Rest is delete Rest0, Rest1,Rest2
    Returns: HTTP 204
    """
    def delete(self, request):
        try:
            for i in range (self.k):
                self.dict[i].objects.all().delete()
            return Response(status= HTTPStatus.NO_CONTENT) 
        except:
            return Response(status = HTTPStatus.BAD_REQUEST)
    
    """
        database create functions
    """  
    def createRest(self, table, data):
        if (data['latitude'] == None):
            data['latitude'] = 0
        if (data['longitude'] == None):
            data['longitude'] = 0
        if (data['categories'] == None):
            data['categories'] = ""
        new = table.objects.create(business_id = data['business_id'],
                                    name = data['name'],
                                    rate = data['rate'],
                                    review_cnt = data['review_cnt'],
                                    city = data['city'],
                                    latitude = data['latitude'],
                                    longitude = data['longitude'],
                                    categories = data['categories'])
        new.save()
    
    def createCity(self, table, data):
        if type(data['Rank']) is str:
            rank = int(data['Rank'].replace(",", "")),  
            newRank = rank[0]
        else:
            newRank =  data['Rank']
        new = table.objects.create(name = data['City'],
                                   rank = newRank,
                                   population = int(data['Population'].replace(",", "")))
        new.save()
    
    def createUser(self, table, data):
        new = table.objects.create(name = data['name'],
                                   id = data['uid'])
        new.save()
    
    def createRate(self, table, data):
        new = table.objects.create(userId = data['uid'],
                                   restId = data['rid'],
                                   score = data['rating'])
        new.save()
    
    

class RestView(AllView):
    
    k = 3
    dict = {   
            0 : Rest0,
            1 : Rest1,
            2 : Rest2
        }

    """
    Method: POST
    URL: localhost:8000/api/restaurants/
    body: 
        {
            "path": [String] "dataSet/test.csv",
            "k" : [Number default is 3] 0
        }
    Returns: table information in the first Partition Table
        _type_: json string
        fields =['business_id', 'name', 'rate', 'review_cnt', 'city', 
                'latitude', 'longitude', 'categories']
    """
    def post(self, request):
       
        path = request.data['path']
        self.k = request.data['k']
        obj1 = pd.read_csv(path);
        jsonObj = obj1.to_json(orient = 'records');
        objs = json.loads(jsonObj);
        # print(objs)
        for rest_data in objs:    
            key = ord(rest_data['business_id'][0]) % self.k
            table = self.dict[key]
            if(self.is_valid_primary_id(rest_data['business_id'], table) == False):
                continue;
            self.createRest(table, rest_data)
        restaurants = self.get_queries(Rest0)
        serializer = RestaurantSpecsSerializer(restaurants, many = True)
        return Response(serializer.data)
    
    """
    Method: GET
    URL: localhost:8000/api/restaurants/?command="checkTable"&table=0
    Returns: restaurants information in Partition Table
        fields =['business_id', 'name', 'rate', 'review_cnt', 'city', 
                'latitude', 'longitude', 'categories']
    """
    def get(self, request, format=None):
        command = request.query_params.get('command')
        if command == 'checkTable':
            table_num = request.query_params.get('table')
            table = self.dict[int(table_num)]
            restaurants = request.get_queries(table)
            serializer = RestaurantSpecsSerializer(restaurants, many = True)
            return Response(serializer.data)
        if command == "cat":
            obj1 = pd.read_csv('dataSet/rest.csv');
            jsonObj = obj1.to_json(orient = 'records');
            return Response(jsonObj)
            
class CityView(AllView):
    
    k = 3
    dict = {   
            0 : City0,
            1 : City1,
            2 : City2
        }

    """
    Method: POST
    URL: localhost:8000/api/city/
    body: 
        {
            "path": String "dataSet/test.csv",
            "k" : Number default is 3
        }
    Returns: table information in the first Partition Table
    """
    def post(self, request):
        path = request.data['path']
        self.k = request.data['k']
        obj1 = pd.read_csv(path);
        jsonObj = obj1.to_json(orient = 'records');
        objs = json.loads(jsonObj);
        # print(objs)
        key = 0
        for data in objs: 
            if type(data['Rank']) is str:
                rank = int(data['Rank'].replace(",", ""))%self.k, 
                key = rank[0]  
            else:
                key =  data['Rank']%self.k
               
            table = self.dict[key]
            # print(key)
            if(self.is_valid_primary_id(data['City'], table) == False):
                continue;
            self.createCity(table, data)
        cities = self.get_queries(City0)
        serializer = CitySpecsSerializer(cities, many = True)
        return Response(serializer.data)
    
    """
    Method: GET partition table info
    URL: localhost:8000/api/city/?command=checkTable&table=0
    Returns: restaurants information in Partition Table
        _type_: json array string
        fields =['name', 'rank', 'population']
        
    Method: GET partition table info
    URL: localhost:8000/api/city/?command=cat
    Returns: CSV json string
    """
    def get(self, request, format=None):
        command = request.query_params.get('command')
        if command == 'checkTable':
            table_num = request.query_params.get('table')
            table = self.dict[int(table_num)]
            cities = self.get_queries(table)
            serializer = CitySpecsSerializer(cities, many = True)
            return Response(serializer.data)
        if command == "cat":
            obj1 = pd.read_csv('dataSet/city.csv');
            jsonObj = obj1.to_json(orient = 'records');
            return Response(jsonObj)
        
class UserView(AllView):
    
    k = 3
    dict = {   
            0 : User0,
            1 : User1,
            2 : User2
        }

    """
    Method: POST
    URL: localhost:8000/api/restUser/
    body: 
        {
            "path": String "dataSet/test.csv",
            "k" : Number default is 3
        }
    Returns: table information in the first Partition Table
    """
    def post(self, request):
        path = request.data['path']
        self.k = request.data['k']
        obj1 = pd.read_csv(path);
        jsonObj = obj1.to_json(orient = 'records');
        objs = json.loads(jsonObj);
        for data in objs:    
            key = ord(data['uid'][0]) % self.k
            table = self.dict[key]
            # print(key)
            if(self.is_valid_primary_id(data['uid'], table) == False):
                continue;
            self.createUser(table, data)
        restUsers = self.get_queries(User0)
        serializer = UserSpecsSerializer(restUsers, many = True)
        return Response(serializer.data)
    
    """
    Method: GET
    URL: localhost:8000/api/restUser/?command=checkTable&table=0
    parameters: table = 0
    Returns: restaurants information in Partition Table
        _type_: json array string
        fields =['name', 'rank', 'population']
    """
    def get(self, request, format=None):
        command = request.query_params.get('command')
        if command == 'checkTable':
            table_num = self.request.query_params.get('table')
            table = self.dict[int(table_num)]
            users = self.get_queries(table)
            serializer = UserSpecsSerializer(users, many = True)
            return Response(serializer.data)
        if command == "cat":
            obj1 = pd.read_csv('dataSet/city.csv');
            jsonObj = obj1.to_json(orient = 'records');
            return Response(jsonObj)
        
class RateView(AllView):      
    k = 3
    dict = {   
            0 : Rate0,
            1 : Rate1,
            2 : Rate2
        }

    """
    Method: POST
    URL: localhost:8000/api/rate/
    body: 
        {
            "path": String "dataSet/test.csv",
            "k" : Number default is 3
        }
    Returns: table information in the first Partition Table
    """
    
    def post(self, request):
        path = request.data['path']
        self.k = request.data['k']
        obj1 = pd.read_csv(path);
        jsonObj = obj1.to_json(orient = 'records');
        objs = json.loads(jsonObj);
        for data in objs:    
            key = data['rating'] % self.k
            table = self.dict[key]
            self.createRate(table, data)
        rates = self.get_queries(Rate0)
        serializer = UserSpecsSerializer(rates, many = True)
        return Response(serializer.data)
    
    """
    Method: GET
    URL: localhost:8000/api/city/?command=checkTable&table=0
    parameters: table = 0
    Returns: restaurants information in Partition Table
        _type_: json array string
        fields =['name', 'rank', 'population']
    """
    def get(self, request, format=None):
        command = request.query_params.get('command')
        if command == 'checkTable':
            table_num = self.request.query_params.get('table')
            table = self.dict[int(table_num)]
            rates = self.get_queries(table)
            serializer = RateSpecsSerializer(rates, many = True)
            return Response(serializer.data)
        if command == "cat":
            obj1 = pd.read_csv('dataSet/city.csv');
            jsonObj = json.dumps(obj1)
            return Response(jsonObj)
    
    def delete(self, request):
        Rate0.objects.all().delete()
        Rate1.objects.all().delete()
        Rate2.objects.all().delete()
        return Response(status= HTTPStatus.NO_CONTENT) 
    
class MapView(AllView):
    k = 3
    dict = {   
            0 : City0,
            1 : City1,
            2 : City2
        }
    """
    Method: GET
    Function:find the score is k(3) and in city (Los Angeles) all the restaurant information
    URL: localhost:8000/api/mapreduce/?dataSet=restaurants&score=3&city=Los Angeles
    
    Function:find the rank of population is among[rankmin, rankmax) and score is k(3) restaurants total number
    URL: localhost:8000/api/mapreduce/?dataSet=cityAndRest&rankmin=5&rankmax=10&score=5
    
    Function:find the rank of population is among[rankmin, rankmax) restaurants total number
    URL: localhost:8000/api/mapreduce/?dataSet=cityAndRest&rankmin=5&rankmax=10&score=5
    
    Funtion: find top k review number restaurant
    URL: localhost:8000/api/mapreduce/?dataSet=restaurants&top_review_num=3
    """
    def get(self, request, format=None):
        dataSet = request.query_params.get('dataSet')
        minscore = request.query_params.get('score')
        city = request.query_params.get('city')
        top_review_num = request.query_params.get('top_review_num')
        res = []
        if (dataSet == 'restaurants' and top_review_num!= None):
            topNum = int(top_review_num);
            r0 = Rest0.objects.order_by('-review_cnt')[:topNum]
            r1 = Rest1.objects.order_by('-review_cnt')[:topNum]
            r2 = Rest2.objects.order_by('-review_cnt')[:topNum]
            h = []
            for obj in r0:
                temp = {}
                temp['review_cnt']= obj.review_cnt
                temp['name']= obj.name
                temp['city']= obj.city
                temp['rate']= obj.rate
                temp['business_id'] = obj.business_id
                h.append(temp)
            for obj in r1:
                temp = {}
                temp['review_cnt']= obj.review_cnt
                temp['name']= obj.name
                temp['city']= obj.city
                temp['rate']= obj.rate
                temp['business_id'] = obj.business_id
                h.append(temp)
            for obj in r2:
                temp = {}
                temp['review_cnt']= obj.review_cnt
                temp['name']= obj.name
                temp['city']= obj.city
                temp['rate']= obj.rate
                temp['business_id'] = obj.business_id
                h.append(temp)
            
            h.sort(key=lambda x:x['review_cnt'], reverse=True)
            for i in range (int(top_review_num)):
                res.append(h[i])
            data = {}
            data['res'] = res;
            return Response(data)
        
        if (dataSet == 'restaurants' and minscore != None and city != None):
            r0 = Rest0.objects.filter(rate = minscore, city = city)
            r1 = Rest1.objects.filter(rate = minscore, city = city)
            r2 = Rest2.objects.filter(rate = minscore, city = city)
            for obj in r0:
                res.append(obj)
            for obj in r1:
                res.append(obj)
            for obj in r2:
                res.append(obj) 
            serializer = RestaurantSpecsSerializer(res, many = True)
            return Response(serializer.data)
        
        if (dataSet == 'restaurants' and minscore == None and city != None):
            r0 = Rest0.objects.filter(city = city)
            r1 = Rest1.objects.filter(city = city)
            r2 = Rest2.objects.filter(city = city)
            for obj in r0:
                res.append(obj)
            for obj in r1:
                res.append(obj)
            for obj in r2:
                res.append(obj)
            serializer = RestaurantSpecsSerializer(res, many = True)
            return Response(serializer.data)
        
        if (dataSet == 'restaurants' and minscore != None and city == None):
            r0 = Rest0.objects.filter(rate = minscore)
            r1 = Rest1.objects.filter(rate = minscore)
            r2 = Rest2.objects.filter(rate = minscore)
            for obj in r0:
                res.append(obj)
            for obj in r1:
                res.append(obj)
            for obj in r2:
                res.append(obj)
            serializer = RestaurantSpecsSerializer(res, many = True)
            return Response(serializer.data)
        
        if(dataSet == "cityAndRest"):
            rankmin = int(request.query_params.get('rankmin'))
            rankmax = int(request.query_params.get('rankmax'))
            if (request.query_params.get('score') != None):
                score = int(request.query_params.get('score'))
                r0 = Rest0.objects.filter(rate = minscore)
                r1 = Rest1.objects.filter(rate = minscore)
                r2 = Rest2.objects.filter(rate = minscore)
            else:
                r0 = Rest0.objects.all();
                r1 = Rest1.objects.all();
                r2 = Rest2.objects.all();
            res = []
            for rank in range(rankmin, rankmax):
                k=rank%3
                num = 0
                city = self.dict[k].objects.get(rank = rank)
                temp = {}
                temp['name'] = city.name
                temp['rank'] = city.rank
                temp['population'] = city.population
                num += len(r0.filter(city = city.name))
                num += len(r1.filter(city = city.name))
                num += len(r2.filter(city = city.name))
                temp['restNum'] = num
                res.append(temp) 
            data = {}
            data['res'] = res;
            # jsonObj = data.to_json(orient = 'records');
            # print(res)
            return Response(data)
         
        
   
        
        
            
            
                
            
    
        