import os
import django
from django.core.files.base import ContentFile

os.environ['CLOUDINARY_URL'] = 'cloudinary://461362986823151:sZETe59XhIO-GBkf7_2iiJVG3xl@lixfodnk'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files.storage import default_storage

print("Starting upload test...")
try:
    path = default_storage.save('test_image.png', ContentFile(b'fake image data'))
    print("Successfully saved to:", path)
    url = default_storage.url(path)
    print("URL:", url)
except Exception as e:
    import traceback
    traceback.print_exc()
