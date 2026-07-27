from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user',)
