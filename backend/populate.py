import os
import django
import sys

# Set up Django
sys.path.append('c:\\Users\\loalo\\OneDrive\\projects\\booking\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from system_settings.models import SiteSetting
from reviews.models import Review
from users.models import User
from bookings.models import Booking
from rooms.models import Room

# 1. Populate Settings
setting, created = SiteSetting.objects.get_or_create(id=1)
setting.address = "24, Jawahar St, opp.to municipal middle school, Adivaram, South Anna Nagar, Palani, Tamil Nadu 624601"
setting.maps_url = "https://www.google.com/maps/search/?api=1&query=24,+Jawahar+St,+opp.to+municipal+middle+school,+Adivaram,+South+Anna+Nagar,+Palani,+Tamil+Nadu+624601"
setting.phone_number = "+91 7010276853"
setting.save()
print("Settings populated.")

# 2. Populate Reviews
# Create a dummy user
user, _ = User.objects.get_or_create(username='guest1', defaults={'password': 'password123'})
user2, _ = User.objects.get_or_create(username='guest2', defaults={'password': 'password123'})

# We need a booking for a review due to OneToOne relation
room, _ = Room.objects.get_or_create(room_number="101", defaults={'type': 'Single', 'price_per_night': 1000, 'capacity': 1, 'description': 'Nice'})
booking1, _ = Booking.objects.get_or_create(user=user, room=room, check_in="2026-08-01", check_out="2026-08-02", defaults={'total_price': 1000, 'num_guests': 1})
booking2, _ = Booking.objects.get_or_create(user=user2, room=room, check_in="2026-08-03", check_out="2026-08-04", defaults={'total_price': 1000, 'num_guests': 1})

# Create reviews
if not Review.objects.exists():
    Review.objects.create(user=user, booking=booking1, rating=5, comment="Absolutely wonderful stay. Highly recommended!")
    Review.objects.create(user=user2, booking=booking2, rating=4, comment="Very clean and peaceful. Perfect for my family trip.")
    print("Reviews populated.")
else:
    print("Reviews already exist.")
