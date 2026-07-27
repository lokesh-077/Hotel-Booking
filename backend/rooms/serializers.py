from rest_framework import serializers
from .models import Room, RoomImage

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image']

class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'
