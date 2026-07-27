from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, ForgotPasswordOTPView, ResetPasswordView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('forgot-password-otp/', ForgotPasswordOTPView.as_view(), name='forgot_password_otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
