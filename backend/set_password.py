import django
import os

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Find Admin
admin = User.objects.filter(username='Admin').first()
if admin:
    admin.set_password('admin123')
    admin.save()
    print("Password set to admin123 for user:", admin.username)
else:
    print("Admin user not found!")
