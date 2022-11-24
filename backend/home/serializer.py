from rest_framework import serializers
from .models import Paths,Relations

class PathSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paths
        fields =['inode', 'pathType', 'name']

class RelationSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relations
        fields =['parent', 'child']