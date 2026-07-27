import django
import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Rename original admin to system_admin if it is not the target user
old_admin = User.objects.filter(username__iexact='admin').first()
if old_admin and old_admin.phone != '7010276853':
    old_admin.username = 'system_admin'
    old_admin.save()
    print("Renamed old admin to system_admin")

# Rename target user to Admin
target = User.objects.filter(phone='7010276853').first()
if target:
    target.username = 'Admin'
    target.save()
    print("Successfully renamed user to", target.username)
else:
    print("User with phone 7010276853 not found.")
