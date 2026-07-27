from rest_framework import serializers
from .models import Booking, OrderGroup
from rooms.serializers import RoomSerializer
from users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    room_detail = RoomSerializer(source='room', read_only=True)
    user_detail = UserSerializer(source='user', read_only=True)
    aadhar_number = serializers.CharField(source='order_group.aadhar_number', read_only=True)
    aadhar_photo = serializers.FileField(source='order_group.aadhar_photo', read_only=True)
    mobile_number = serializers.CharField(source='order_group.mobile_number', read_only=True)
    address = serializers.CharField(source='order_group.address', read_only=True)
    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'status')

    def get_has_review(self, obj):
        return hasattr(obj, 'review')

class OrderGroupSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    
    class Meta:
        model = OrderGroup
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'status')
