from django.db import models
from django.conf import settings
from rooms.models import Room

class OrderGroup(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='order_groups')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    payment_mode = models.CharField(max_length=20, default='online')
    address = models.TextField(null=True, blank=True)
    mobile_number = models.CharField(max_length=15, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, null=True, blank=True)
    aadhar_photo = models.FileField(upload_to='aadhar_photos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OrderGroup #{self.id} - {self.user.username}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    PAYMENT_MODE_CHOICES = (
        ('online', 'Online Payment'),
        ('pod', 'Pay on Delivery'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    order_group = models.ForeignKey(OrderGroup, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.IntegerField(default=1)
    children = models.IntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default='online')
    is_noted = models.BooleanField(default=False)
    cancelled_by = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} - {self.room.room_number}"
