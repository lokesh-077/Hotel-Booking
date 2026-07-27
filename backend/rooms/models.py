from django.db import models

class Room(models.Model):
    ROOM_TYPES = (
        ('Single', 'Single'),
        ('Double', 'Double'),
        ('Suite', 'Suite'),
    )
    room_number = models.CharField(max_length=10, unique=True)
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()
    facilities = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to='rooms/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.room_number} - {self.type}"

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='rooms/gallery/')

    def __str__(self):
        return f"Image for {self.room.room_number}"
