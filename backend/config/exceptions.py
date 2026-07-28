from rest_framework.views import exception_handler
from rest_framework.response import Response
import traceback
import sys

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        # Unhandled exception
        tb = traceback.format_exc()
        return Response({
            "error": str(exc),
            "traceback": tb
        }, status=500)
    return response
