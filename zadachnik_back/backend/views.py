from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Logs, Topics, TypesTopic
from .serializers import *
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes, authentication_classes


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
        if TYPES_MAPPING[type_list] == 3:
            queryset = Topics.objects.filter(
                type_topic=type_, status=Statuses.objects.get(id=1)).exclude(user=user.id)
            serialized_data = TopicsCardSerializer(queryset, many=True).data
        elif user.is_teacher:
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


class TopicPageAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        queryset = Topics.objects.get(id=pk)
        serialized_data = TopicSerializer(queryset, many=False).data
        return Response(serialized_data, status=status.HTTP_200_OK)


class UserTopicsAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        id_statuses = request.query_params.get('id_status', 1).split(',')
        types_topic = request.query_params.get('type_topic', '1,2').split(',')
        is_confirmed = request.query_params.get('is_confirmed', False)

        queryset = Topics.objects.filter(
            user=user, status__id__in=id_statuses, type_topic__id__in=types_topic)
        serialized_data = TopicSerializer(queryset, many=types_topic).data

        logs_data = []
        for topic_data in serialized_data:
            topic_id = topic_data['id']
            # Формируем queryset логов, связанных с текущей темой и адресованных пользователю
            if is_confirmed:
                logs_query = Logs.objects.filter(
                    topic_id=topic_id, user_from=user, action__id=2)
            else:
                excluded_requests = Logs.objects.filter(topic_id=topic_id, action__id__in=[
                                                        2, 3, 4]).values_list('user_to', flat=True)
                logs_query = Logs.objects.filter(
                    topic_id=topic_id, user_to=user, action__id=1).exclude(user_from__in=excluded_requests)

            logs_data.extend(LogsSerialuzer(logs_query, many=True).data)

            # Добавляем количество последних логов для текущей темы к данным о теме
            topic_data['feedback'] = logs_query.count()

        # Сортируем список логов по дате события
        logs_data = sorted(logs_data, key=lambda x: x['date_action'])

        return Response({'topics': serialized_data, 'logs': logs_data}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data

        data['user'] = user.id
        data['status'] = 1

        serializer = TopicSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=user)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        data = request.data
        data['user'] = user.id
        topic_id = data.get('id')

        if topic_id is None:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            topic = Topics.objects.get(user=user, id=topic_id)
        except Topics.DoesNotExist:
            return Response({"error": "Topic not found"}, status=status.HTTP_404_NOT_FOUND)

        data.pop('date_create', None)
        serializer = TopicSerializer(topic, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def topics_search(request):
    user = request.user
    query = request.GET.get('q', '')
    q_objects = (
        Q(user__name__icontains=query) |  # Поиск по имени пользователя
        # Поиск по фамилии пользователя
        Q(user__surename__icontains=query) |
        # Поиск по отчеству пользователя
        Q(user__midname__icontains=query) |
        Q(name__icontains=query) |  # Поиск по названию темы
        Q(discription__icontains=query) |  # Поиск по описанию темы
        Q(tags__name__icontains=query)  # Поиск по тегам
    )

    topics = Topics.objects.filter(
        q_objects, status=Statuses.objects.get(id=1), user__is_teacher=(not user.is_teacher)).distinct()
    if not user.is_teacher:
        topics = topics.filter(
            direction_traning=user.group.direction_traning)
    serialized_data = TopicsCardSerializer(topics, many=True).data

    return Response(serialized_data, status=status.HTTP_200_OK)


class DefaultDataAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        types_data = TypeTopicSerialuzer(
            TypesTopic.objects.all(), many=True).data
        directions_data = DirectionTraningSerialuzer(
            DirectionTraning.objects.all(), many=True).data

        return Response({"types": types_data, "directions": directions_data}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_status_topic(request):
    data = request.data
    topic_id = data.get('topic_id')
    status_id = data.get('status_id')

    topic = Topics.objects.get(id=topic_id)
    status_ = Statuses.objects.get(id=status_id)
    topic.status = status_
    topic.save()

    return Response(status=status.HTTP_200_OK)


class LogsAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        user_to_logs = Logs.objects.filter(
            user_to=user, action__in=[2, 3, 4])
        exclude_to = user_to_logs.values_list('topic', flat=True)
        user_from_logs = Logs.objects.filter(
            user_from=user, action_id=1).exclude(topic__in=exclude_to)

        result_logs = user_from_logs | user_to_logs

        logs_data = LogsSerialuzer(result_logs, many=True).data

        return Response(logs_data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data

        data.pop('date_action', None)

        serializer = LogsSerialuzer(data=data)

        if serializer.is_valid():
            if data['action'] == 2:
                topic = Topics.objects.get(id=data['topic'])
                logs = Logs.objects.filter(topic=topic, action=2)

                if (topic.count_users == len(logs) + 1):
                    topic.status = Statuses.objects.get(id=2)

                    topic_logs = Logs.objects.filter(
                        topic=topic.id, action__in=[1, 2]).exclude(user_from=data['user_to'])
                    result_logs = topic_logs.order_by(
                        'topic', 'user_from', '-action')
                    final_logs = result_logs.distinct(
                        'topic', 'user_from').filter(action=1)
                    if (len(final_logs)):
                        cancel_feedback = Actions.objects.get(id=4)
                        for item in final_logs:
                            Logs.objects.create(
                                topic=topic,
                                user_from=topic.user,
                                user_to=item.user_from,
                                action=cancel_feedback,
                            )

                if (topic.type_topic != 3 and not user.is_teacher):
                    user.topic_is_set = True

                topic.save()
                user.save()
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print("ZZZ", serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProjectLogsAPIView(APIView):
    authentication_classes = [BasicAuthentication,
                              SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        force_logs = Logs.objects.filter(
            topic__id=pk, action__in=[2, 3, 4])
        exclude_users = force_logs.values_list('user_to', flat=True)
        query_logs = Logs.objects.filter(
            topic__id=pk, action__id=1).exclude(user_from__id__in=exclude_users)

        result_logs = force_logs | query_logs

        logs_data = LogsSerialuzer(result_logs, many=True).data

        return Response(logs_data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = request.user
        select_log = Logs.objects.get(id=pk)
        select_log.action = Actions.objects.get(id=3)
        select_log.save()

        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_my_list_profects(request):
    user = request.user

    topics = Topics.objects.filter(user=user.id, type_topic=3)
    serializer_data = TopicSerializer(topics, many=True).data

    return Response(serializer_data, status=status.HTTP_200_OK)
