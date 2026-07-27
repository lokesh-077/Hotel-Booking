from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and getattr(user, 'role', '') == 'admin':
            return Room.objects.all()
        return Room.objects.filter(is_visible=True)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        room = Room.objects.get(id=response.data['id'])
        self._handle_gallery_images(request, room)
        return Response(self.get_serializer(room).data)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        room = self.get_object()
        self._handle_gallery_images(request, room)
        return Response(self.get_serializer(room).data)

    def _handle_gallery_images(self, request, room):
        gallery_images = request.FILES.getlist('gallery_images')
        from .models import RoomImage
        for image in gallery_images:
            RoomImage.objects.create(room=room, image=image)
