"""
ASGI config for zadachnik_back project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path
from .consumers import NotificationConsumer
from .middleware import TokenAuthMiddleware
from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zadachnik_back.settings')
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            TokenAuthMiddleware(
                URLRouter(
                    [re_path(r"ws/nofityes/", NotificationConsumer.as_asgi())]
                )
            )
        ),
    }
)
