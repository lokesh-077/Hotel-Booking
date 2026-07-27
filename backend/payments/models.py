from django.db import models
from bookings.models import Booking, OrderGroup

class Payment(models.Model):
    METHOD_CHOICES = (
        ('online', 'Online'),
        ('cash', 'Cash at Hotel'),
    )
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('pending', 'Pending'),
    )
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment', null=True, blank=True)
    order_group = models.OneToOneField(OrderGroup, on_delete=models.CASCADE, related_name='payment', null=True, blank=True)
    method = models.CharField(max_length=15, choices=METHOD_CHOICES, default='cash')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        if self.order_group:
            return f"Payment #{self.id} for OrderGroup #{self.order_group.id}"
        return f"Payment #{self.id} for Booking #{self.booking.id if self.booking else 'N/A'}"
