from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
import random
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = RegisterSerializer.Meta.model.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid Credentials'}, status=401)



class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ForgotPasswordOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('phone')
        if not identifier:
            return Response({'error': 'Email address is required'}, status=400)
            
        from .models import User
        user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first() or User.objects.filter(phone=identifier).first()
        if not user:
            return Response({'error': 'No account found with this email address'}, status=404)
            
        otp = str(random.randint(100000, 999999))
        
        # Cache OTP under all known identifiers for this user
        cache.set(f'forgot_otp_{identifier}', otp, timeout=300)
        if user.phone:
            cache.set(f'forgot_otp_{user.phone}', otp, timeout=300)
        if user.email:
            cache.set(f'forgot_otp_{user.email}', otp, timeout=300)
        if user.username:
            cache.set(f'forgot_otp_{user.username}', otp, timeout=300)
        
        print(f"FORGOT PASSWORD OTP for {identifier} is {otp}")
        
        # Attempt Gmail SMTP email sending if configured
        if user.email and settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD:
            try:
                subject = "NS Mahal - Password Reset Verification Code"
                message = f"Hello {user.first_name or user.username},\n\nYou requested to reset your password for your NS Mahal account.\n\nYour 6-digit Verification Code (OTP) is: {otp}\n\nThis code is valid for 5 minutes. If you did not request a password reset, please ignore this email.\n\nBest regards,\nNS Mahal Administration"
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False
                )
                return Response({'message': f'OTP sent to your email ({user.email})'})
            except Exception as e:
                print(f"SMTP Error sending email: {e}")
                if not settings.DEBUG:
                    return Response({'error': 'Failed to send OTP email via SMTP. Please check server mail configurations.'}, status=500)
        
        return Response({'message': 'OTP generated successfully'})

class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('phone')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([identifier, otp, new_password]):
            return Response({'error': 'All fields are required'}, status=400)
            
        cached_otp = cache.get(f'forgot_otp_{identifier}')
        if not cached_otp or str(cached_otp) != str(otp):
            return Response({'error': 'Invalid or expired OTP code'}, status=400)
            
        from .models import User
        user = User.objects.filter(username=identifier).first() or User.objects.filter(phone=identifier).first() or User.objects.filter(email=identifier).first()
        if user:
            user.set_password(new_password)
            user.save()
            # Clean up cache
            cache.delete(f'forgot_otp_{identifier}')
            if user.phone: cache.delete(f'forgot_otp_{user.phone}')
            if user.email: cache.delete(f'forgot_otp_{user.email}')
            if user.username: cache.delete(f'forgot_otp_{user.username}')
            return Response({'message': 'Password reset successfully'})
            
        return Response({'error': 'User account not found'}, status=404)
