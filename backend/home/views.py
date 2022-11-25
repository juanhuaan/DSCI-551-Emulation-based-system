from django.shortcuts import render
from .models import Relations,Part,Paths
from django.contrib import admin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializer import PathSpecsSerializer, RelationSpecsSerializer
import pandas as pd
from http import HTTPStatus
import json
import uuid

# Create your views here.

class CommandView(APIView):
    dict = {
        "rest.csv" :"Rest",
        "rate.csv" :"Rate",
        "city.csv" :"City",
        "user.csv" :"User"
    }
    """
    Method: POST
    Function: mkdir, put
    URL: localhost:8000/api/commands/
     {
        "absolute_path": "/user",
        "type":"DIRECTORY",
        "command":"mkdir_or_put"
        "k": 3
     }
    return: all the path information
    """
    def post(self, request):
        k = 3
        route = request.data['command']
        if (route == "mkdir_or_put"):
            path = request.data['absolute_path']
            rootId = Paths.objects.get(name = '.').inode
            curId = self.get_current_path_inode(path)
            if (curId != "NotFound!"):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            type = request.data['type']
            lst = path.split('/')
            # print(lst)
            newDir = lst[-1]
            upperPath = '/'.join(lst[i] for i in range(len(lst) - 1));
            upperNode = self.get_current_path_inode(upperPath);
            upperObj = Paths.objects.get(inode = upperNode)
            newId = str(uuid.uuid4())
            newPath = Paths.objects.create(inode = newId, pathType = type, name = newDir)
            newPath.save()
            newRelation = Relations.objects.create(parent = upperObj, child = newPath)
            newRelation.save()
            if (type == "FILE"):
                k = request.data['k']
                arr_temp = newDir.split(".")
                loc = arr_temp[-2]
                locations = ""
                for i in range (k):
                    locations += loc + str(i) + "_"
                # print(locations)
                # print(newPath.inode)
                part = Part.objects.create(inode = newPath, location = locations)
                part.save()
            paths = Paths.objects.all()
            serializer = PathSpecsSerializer(paths, many = True)
            return Response(serializer.data)
    
    """
    USED BY ADMIN!!
    Method: PUT
    Fuction: initialization 
    URL: localhost:8000/api/commands/
    body: 
        {
            "absolute_path": '.'(Optional)
        }
    Returns: null
    """
    def put(self, request):
        rootId = str(uuid.uuid4())
        rootName = '.'
        if Paths.objects.filter(name =".").exists():
            return Response(HTTPStatus.ALREADY_REPORTED)
        newPath = Paths.objects.create(inode = rootId, pathType = "DIRECTORY", name = rootName)
        newPath.save()
        paths = Paths.objects.all()
        serializer = PathSpecsSerializer(paths, many = True)
        return Response(serializer.data)
    
    """
    Method: GET
    Func: ls
    URL: localhost:8000/api/commands/
    body: 
        {
            "absolute_path": ' /user', 
            "command": 'ls'
        }
    return: all the subpath information
    
    Func: checkAllPath
    URL: localhost:8000/api/commands/?command=checkAllPath&absolute_path=/user/John
    return: all the paths information
    
    Func: go back to upper directory
    URL: localhost:8000/api/commands/?command=goback&absolute_path=/user/John
    return: all the paths information
    
    Func: cat path
    URL: localhost:8000/api/commands/?command=cat&absolute_path=/user/John
    return: cat path
    """
    def get(self, request):
        route = request.query_params.get('command')
        if (route == 'checkAllPath'):
            paths = Paths.objects.all()
            serializer = PathSpecsSerializer(paths, many = True)
            return Response(serializer.data)
        
        elif(route == 'ls'):
            path = request.query_params.get('absolute_path')
            curId = self.get_current_path_inode(path)
            curObj = Paths.objects.get(inode = curId)
            allChild = Relations.objects.filter(parent=curObj)
            res = []
            for obj in allChild:
                childInode = obj.child.inode
                res.append(Paths.objects.get(inode = childInode))
            serializer = PathSpecsSerializer(res, many = True)
            return Response(serializer.data)
         
        elif(route == 'relations'):
            relations = Relations.objects.all()
            serializer = RelationSpecsSerializer(relations, many = True)
            return Response(serializer.data)
        
        elif (route == 'goback'):
            path = request.query_params.get('absolute_path')
            lst = path.split('/')
            upperPath = '/'.join(lst[i] for i in range(len(lst) - 1));
            upperNode = self.get_current_path_inode(upperPath);
            upperObj = Paths.objects.get(inode = upperNode)
            allChild = Relations.objects.filter(parent=upperObj)
            res = []
            for obj in allChild:
                childInode = obj.child.inode
                res.append(Paths.objects.get(inode = childInode))
            serializer = PathSpecsSerializer(res, many = True)
            return Response(serializer.data)
        elif (route == 'cat'):
            path = request.query_params.get('absolute_path')
            lst = path.split('/')
            filepath = lst[-1]
            obj1 = pd.read_csv('dataSet'+ filepath);
            jsonObj = obj1.to_json(orient = 'records');
            return Response(jsonObj)
            
     
    """
    Method: DELETE
    Fuction: delete a singal path and relation with this path, if it is a file delete its partitions
    URL: localhost:8000/api/commands/
    body: 
        {
            "absolute_path": "/marry", 
            "command": "deleteOnePath"
        }
    return: HTTPCode 204
        
    Fuction: delete all path and relation with this path, ADMIN USED!
    URL: localhost:8000/api/commands/
    body: 
        {
            "absolute_path": "/", 
            "command": "deleteAllPath"
        }
    """
    def delete(self, request):
        route = request.data['command']
        if (route == 'deleteAllPath'):
            Paths.objects.all().delete()
            Relations.objects.all().delete()
            Part.objects.all().delete()
            return Response(status= HTTPStatus.NO_CONTENT)
        
        elif(route == 'deleteOnePath'):
            cur_inode = self.get_current_path_inode(request.data['absolute_path'])
            curObj = Paths.objects.get(inode = cur_inode)
            res = []
            res.append(curObj.inode)
            self.get_all_child_path(curObj, res)
            print(res)
            for obj in res:
                Paths.objects.get(inode = obj).delete();
            return Response(status= HTTPStatus.NO_CONTENT)
            
    """
    helper functions
    """
    def get_current_path_inode(self, path):
        path = path.strip()
        if path == "/":
            return Paths.objects.get(name = ".").inode
        nameList = path.split('/')
        nameList[0] = '.'
        lens = len(nameList)
        rootId = Paths.objects.get(name = ".").inode;
        preId = Paths.objects.get(name = ".").inode;
        check = True;
        for i in range(lens - 1):
            root = Paths.objects.get(inode = rootId)
            arr = Relations.objects.filter(parent = root)
            childName = nameList[i + 1];
            for obj in arr:
                childInode = obj.child.inode
                if (Paths.objects.get(inode = childInode).name == childName):
                    rootId = childInode;
                else:
                    continue;
            if rootId == preId:
                return "NotFound!"
            else:
                preId = rootId
            
        return rootId;


    def get_all_child_path(self,curObj,res):
        temp= Relations.objects.filter(parent = curObj)
        if len(temp) == 0:
            return;
        else:
            for sin in temp:
                res.append(sin.child.inode)
                nextObj = Paths.objects.get(inode = sin.child.inode)
                self.get_all_child_path(nextObj, res)
            