from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking, OrderGroup
from rooms.models import Room
from .serializers import BookingSerializer, OrderGroupSerializer
from datetime import datetime
from django.conf import settings
import razorpay
from payments.models import Payment

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        days = (check_out - check_in).days
        total_price = room.price_per_night * days if days > 0 else room.price_per_night
        
        serializer.save(user=self.request.user, total_price=total_price)

    @action(detail=True, methods=['post'])
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ['cancelled', 'completed']:
            return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Refund will be handled manually by the admin
        
        booking.status = 'cancelled'
        booking.cancelled_by = 'admin' if request.user.role == 'admin' else 'user'
        booking.save()
        return Response({'status': 'Booking cancelled'})

    @action(detail=True, methods=['post'])
    def mark_noted(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can mark bookings as noted'}, status=status.HTTP_403_FORBIDDEN)
        booking = self.get_object()
        # Toggle is_noted
        booking.is_noted = not booking.is_noted
        booking.save()
        return Response({'status': 'Booking note status toggled', 'is_noted': booking.is_noted})

    @action(detail=False, methods=['post'])
    def checkout_cart(self, request):
        import json
        items_raw = request.data.get('items', '[]')
        if isinstance(items_raw, str):
            try:
                items = json.loads(items_raw)
            except json.JSONDecodeError:
                items = []
        else:
            items = items_raw

        payment_mode = request.data.get('payment_mode', 'online')
        address = request.data.get('address', '')
        mobile_number = request.data.get('mobile_number', '')
        aadhar_number = request.data.get('aadhar_number', '')
        aadhar_photo = request.FILES.get('aadhar_photo')
        
        if not items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = 0
        bookings_to_create = []
        
        for item in items:
            room = Room.objects.get(id=item['room'])
            check_in_date = datetime.strptime(item['check_in'], '%Y-%m-%d').date()
            check_out_date = datetime.strptime(item['check_out'], '%Y-%m-%d').date()
            days = (check_out_date - check_in_date).days
            price = room.price_per_night * days if days > 0 else room.price_per_night
            total_price += price
            
            bookings_to_create.append(Booking(
                user=request.user,
                room=room,
                check_in=check_in_date,
                check_out=check_out_date,
                adults=item.get('adults', 1),
                children=item.get('children', 0),
                payment_mode=payment_mode,
                total_price=price,
                status='pending'
            ))
            
        order_group = OrderGroup.objects.create(
            user=request.user,
            total_price=total_price,
            payment_mode=payment_mode,
            address=address,
            mobile_number=mobile_number,
            aadhar_number=aadhar_number,
            aadhar_photo=aadhar_photo,
            status='pending'
        )
        
        for booking in bookings_to_create:
            booking.order_group = order_group
            booking.save()
            
        bill_msg = f"""
==================================================
              NS MAHAL - BOOKING BILL
==================================================
To: {request.user.username}
Phone: {mobile_number}
Total Amount: ₹{total_price}
Bookings: {len(bookings_to_create)} Room(s)
Order ID: {order_group.id}
==================================================
Thank you for choosing NS Mahal!
"""
        print(f"\n[SMS SENT TO {mobile_number}]\n{bill_msg}\n")
            
        return Response({'order_group_id': order_group.id})

class OrderGroupViewSet(viewsets.ModelViewSet):
    serializer_class = OrderGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return OrderGroup.objects.all()
        return OrderGroup.objects.filter(user=user)
