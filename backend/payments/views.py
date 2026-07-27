from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
import razorpay
from .models import Payment
from .serializers import PaymentSerializer
from bookings.models import Booking, OrderGroup

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(booking__user=user)

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']
        
        # Original create logic for cash payments
        serializer.save(
            amount=booking.total_price, 
            status='paid',
            paid_at=timezone.now()
        )
        
        # Update booking status
        booking.status = 'confirmed'
        booking.save()

    @action(detail=False, methods=['post'])
    def create_razorpay_order(self, request):
        order_group_id = request.data.get('order_group_id')
        try:
            order_group = OrderGroup.objects.get(id=order_group_id, user=request.user)
        except OrderGroup.DoesNotExist:
            return Response({'error': 'Order Group not found'}, status=status.HTTP_404_NOT_FOUND)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        amount_in_paise = int(order_group.total_price * 100)

        payment_data = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'receipt_og_{order_group.id}',
            'payment_capture': 1
        }
        try:
            razorpay_order = client.order.create(data=payment_data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Create Payment record with pending status
        payment, created = Payment.objects.get_or_create(order_group=order_group, defaults={
            'amount': order_group.total_price,
            'method': 'online',
            'status': 'pending'
        })
        payment.razorpay_order_id = razorpay_order['id']
        payment.save()

        return Response({
            'razorpay_order_id': razorpay_order['id'],
            'amount': amount_in_paise,
            'currency': 'INR',
            'razorpay_key_id': settings.RAZORPAY_KEY_ID
        })

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Invalid Signature'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = 'paid'
            payment.paid_at = timezone.now()
            payment.save()

            payment.save()

            order_group = payment.order_group
            if order_group:
                order_group.status = 'confirmed'
                order_group.save()
                for booking in order_group.bookings.all():
                    booking.status = 'confirmed'
                    booking.save()
            elif payment.booking:
                payment.booking.status = 'confirmed'
                payment.booking.save()

            return Response({'status': 'Payment successful'})
        except Payment.DoesNotExist:
            return Response({'error': 'Payment record not found'}, status=status.HTTP_404_NOT_FOUND)
