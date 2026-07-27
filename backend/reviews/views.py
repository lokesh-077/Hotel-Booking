from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or request.user.role == 'admin'

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
    queryset = Review.objects.all()

    def perform_create(self, serializer):
        reviewer_name = self.request.data.get('reviewer_name')
        if self.request.user.role == 'admin' and reviewer_name:
            serializer.save(user=None, reviewer_name=reviewer_name)
        else:
            serializer.save(user=self.request.user)
