import django
import os

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Ensure admin user exists with username 'admin', role 'admin', and password 'admin123'
user = User.objects.filter(username__iexact='admin').first()
if not user:
    user = User.objects.filter(phone='7010276853').first()

if not user:
    user = User.objects.create_superuser('admin', 'admin@nsmahal.com', 'admin123')
    user.role = 'admin'
    user.phone = '7010276853'
    user.save()
    print("Created new admin user -> username: admin | phone: 7010276853 | password: admin123")
else:
    user.username = 'admin'
    user.role = 'admin'
    user.phone = '7010276853'
    user.set_password('admin123')
    user.save()
    print("Admin user updated -> username: admin | phone: 7010276853 | password: admin123")
