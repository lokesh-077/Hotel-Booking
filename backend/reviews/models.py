from django.db import models
from django.conf import settings
from bookings.models import Booking

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review', null=True, blank=True)
    reviewer_name = models.CharField(max_length=255, null=True, blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name = self.user.username if self.user else self.reviewer_name
        return f"Review by {name} - {self.rating} Stars"
