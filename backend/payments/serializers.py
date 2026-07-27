from rest_framework import serializers
from .models import Payment
from bookings.serializers import BookingSerializer

class PaymentSerializer(serializers.ModelSerializer):
    booking_detail = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('status', 'amount')
