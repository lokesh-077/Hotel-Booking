from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, OrderGroupViewSet

router = DefaultRouter()
router.register(r'order-groups', OrderGroupViewSet, basename='ordergroup')
router.register(r'', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
