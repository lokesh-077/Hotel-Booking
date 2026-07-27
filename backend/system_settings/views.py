from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import SiteSetting
from .serializers import SiteSettingSerializer

class SiteSettingView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        setting, created = SiteSetting.objects.get_or_create(id=1)
        serializer = SiteSettingSerializer(setting)
        return Response(serializer.data)

    def put(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        setting, created = SiteSetting.objects.get_or_create(id=1)
        serializer = SiteSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
