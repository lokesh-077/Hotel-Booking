import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def create_admin():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'adminpass', role='admin')
        print("Admin user created (username: admin, password: adminpass)")
    else:
        print("Admin user already exists.")

if __name__ == '__main__':
    create_admin()
