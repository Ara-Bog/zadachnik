"""
URL configuration for zadachnik_back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from backend.views import *
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/users/', UserListAPIView.as_view(), name='user_list'),
    path('api/users/current-detail/', UserAPIView.as_view(), name='user_detail'),
    path('api/users/<int:pk>', UserPageAPIView.as_view(),
         name='user_page'),
    path('api/user/notificates_short/',
         NotificateShortAPIView.as_view(), name='notificates_short'),
    path('api/profile/topics/<int:id_status>', MyTopicsAPIView.as_view(),
         name='profile-topics_list'),
    path('api/topics/<str:type_list>',
         TopicsListAPIView.as_view(), name='topics_list'),
    path('api/topic/<int:pk>', TopicPage.as_view(),
         name='topic_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
