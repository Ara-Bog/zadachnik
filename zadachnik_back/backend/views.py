from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Logs, Topics, TypesTopic
from .serializers import *
from django.db.models import Subquery, OuterRef, Max, F


class UserListAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = CustomUser.objects.get(id=user.id)
        serializer_class = CustomUserSerializer(queryset, many=False)

        return Response({**serializer_class.data, "addreviated_name": str(user)}, status=status.HTTP_200_OK)


class UserPageAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        queryset = CustomUser.objects.get(id=pk)
        user_data = CustomUserSerializer(queryset, many=False).data
        topics_data = GroupTopicsType(queryset, user_to=user).data

        return Response({'user': user_data, **topics_data}, status=status.HTTP_200_OK)


class NotificateShortAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = Logs.objects.filter(user_to=user.id, isChecked=False)
        serializer = NotificateShortSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        Logs.objects.filter(
            user_to=user.id, isChecked=False).update(isChecked=True)

        return Response(status=status.HTTP_200_OK)


TYPES_MAPPING = {
    'vkr': 1,
    'course': 2,
    'project': 3,
}


class TopicsListAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, type_list):
        user = request.user
        type_ = TypesTopic.objects.get(id=TYPES_MAPPING[type_list])

        if user.is_teacher:
            queryset = Topics.objects.filter(
                user__is_teacher=False, type_topic=type_, status=Statuses.objects.get(id=1))
            serialized_data = TopicsCardSerializer(queryset, many=True).data
        else:
            queryset = CustomUser.objects.filter(is_teacher=True, topics__type_topic=type_,
                                                 topics__isnull=False, topics__direction_traning=user.group.direction_traning,
                                                 topics__status=Statuses.objects.get(id=1)).distinct()
            serialized_data = TeachersCardTopics(
                queryset, many=True, direction_traning=user.group.direction_traning, type_topic=type_).data

        return Response(serialized_data, status=status.HTTP_200_OK)


class MyTopicsAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id_status):
        user = request.user

        queryset = Topics.objects.filter(user=user, status__id=id_status)
        serialized_data = TopicSerializer(queryset, many=True).data

        logs_data = []
        for topic_data in serialized_data:
            topic_id = topic_data['id']
            logs_query = Logs.objects.filter(
                topic_id=topic_id, action__id=1, user_to=user)

        # Get the latest log for each user_from using a subquery
            latest_logs_query = Logs.objects.filter(
                id__in=logs_query.values('user_from').annotate(max_id=Max('id')).values('max_id'))
            logs_data.extend(LogsSerialuzer(latest_logs_query, many=True).data)

            topic_data['feedback'] = latest_logs_query.count()

        logs_data = sorted(logs_data, key=lambda x: x['date_action'])

        return Response({'topics': serialized_data, 'logs': logs_data}, status=status.HTTP_200_OK)


class TopicPage(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        queryset = Topics.objects.get(id=pk)
        serialized_data = TopicSerializer(queryset, many=False).data
        return Response(serialized_data, status=status.HTTP_200_OK)
