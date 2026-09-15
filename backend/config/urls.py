from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse
def run_seeding(request):
    import seed_rooms
    seed_rooms.seed()
    return JsonResponse({"status": "Rooms successfully seeded! You can close this tab and check your website!"})

from django.shortcuts import render

def custom_page_not_found(request, exception=None):
    if request.path.startswith('/api/'):
        return JsonResponse({"detail": "Not found.", "status": 404}, status=404)
    return render(request, '404.html', status=404)

handler404 = 'config.urls.custom_page_not_found'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/settings/', include('system_settings.urls')),
    path('api/seed/', run_seeding),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
