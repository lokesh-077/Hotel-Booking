import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.files.storage import default_storage

print("Default Storage Class:", default_storage.__class__)
try:
    print("Cloudinary Config:", default_storage.api_key)
except Exception as e:
    print("Error:", e)
