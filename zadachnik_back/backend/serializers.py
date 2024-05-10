from rest_framework import serializers
from .models import *


class CustomUserSerializer(serializers.ModelSerializer):
    direction_traning = serializers.SerializerMethodField()
    direction_traning__str = serializers.SerializerMethodField()
    select_topic = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['name', 'surename', 'midname', 'is_teacher',
                  'id', 'email', 'discription', 'avatar', 'group', 'direction_traning', 'direction_traning__str', 'select_topic']

    def get_direction_traning(self, obj):
        return obj.group.direction_traning.pk if obj.group else None

    def get_direction_traning__str(self, obj):
        return str(obj.group.direction_traning) if obj.group else None

    def get_select_topic(self, obj):
        if (obj.is_teacher or not obj.topic_is_set):
            return ""
        return TopicSerializer(Logs.objects.get(user_to=obj.id, action__id=2, topic__type_topic__in=[1, 2]).topic).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['group'] = str(
            instance.group) if instance.group else None

        representation['user'] = str(instance)
        return representation


class NotificateShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['avatar__to'] = str(instance.user_to.avatar)
        representation['avatar__from'] = str(instance.user_from.avatar)
        representation['action__str'] = str(instance.action)
        representation['user_from__str'] = str(instance.user_from)
        representation['user_to__str'] = str(instance.user_to)
        representation['topic__str'] = str(instance.topic.name)
        representation['topic_id'] = instance.topic.id

        return representation


class TagsField(serializers.Field):
    def to_representation(self, value):
        return value

    def to_internal_value(self, data):
        return data


class TopicSerializer(serializers.ModelSerializer):
    tags = TagsField(source="get_tags")
    select_users = serializers.SerializerMethodField()

    class Meta:
        model = Topics
        fields = '__all__'

    def get_select_users(self, obj):
        return Logs.objects.filter(topic=obj.id, action__id=2).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = instance.tags.names()

        representation['user'] = str(instance.user)
        representation['avatar'] = str(instance.user.avatar)
        representation['isDistributed'] = instance.status == Statuses.objects.get(
            id=2)
        representation['user_id'] = instance.user.id
        representation['date_create'] = instance.date_create.strftime(
            "%d.%m.%Y")
        representation['direction_traning__str'] = str(
            instance.direction_traning)
        representation['type_topic__str'] = str(instance.type_topic)
        representation['status__str'] = str(instance.status)
        return representation

    def create(self, validated_data):
        tags_data = validated_data.pop('get_tags', None)
        instance = Topics.objects.create(**validated_data)

        if tags_data:
            instance.tags.set(tags_data)

        return instance


class TopicsCardSerializer(serializers.ModelSerializer):
    tags = TagsField(source="get_tags")
    select_users = serializers.SerializerMethodField()

    class Meta:
        model = Topics
        fields = '__all__'

    def get_select_users(self, obj):
        return Logs.objects.filter(topic=obj.id, action__id=2).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = instance.tags.names()
        representation['date_create'] = instance.date_create.strftime(
            "%d.%m.%Y")
        representation['user'] = str(instance.user)
        representation['avatar'] = str(instance.user.avatar)
        representation['direction_traning__str'] = str(
            instance.direction_traning)
        return representation


class TeachersCardTopics(serializers.ModelSerializer):
    topics_data = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.direction_traning = kwargs.pop('direction_traning')
        self.type_topic = kwargs.pop('type_topic', None)
        super(TeachersCardTopics, self).__init__(*args, **kwargs)

    class Meta:
        model = CustomUser
        fields = ['discription', 'id',
                  'topics_data', 'user', 'avatar']

    def get_user(self, obj):
        return str(obj)

    def get_topics_data(self, obj):
        queryset = Topics.objects.filter(
            user=obj,
            direction_traning=self.direction_traning,
            status=Statuses.objects.get(id=1)
        )
        if self.type_topic:
            queryset = queryset.filter(type_topic=self.type_topic)
        return TopicSerializer(queryset, many=True).data


class GroupTopicsType(serializers.ModelSerializer):
    topics_data = serializers.SerializerMethodField()
    topics_distributed = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user_to')
        super(GroupTopicsType, self).__init__(*args, **kwargs)

    class Meta:
        model = CustomUser
        fields = ['topics_data', 'topics_distributed']

    def get_topics_data(self, obj):
        if self.user.is_teacher:
            topics_queryset = Topics.objects.filter(user=obj, status=1)
        else:
            topics_queryset = Topics.objects.filter(
                user=obj, status=1, direction_traning=self.user.group.direction_traning)
        topics_grouped_by_type = {}
        for topic in topics_queryset:
            type_name = topic.type_topic.name
            if not type_name in topics_grouped_by_type:
                topics_grouped_by_type[type_name] = []
            topics_grouped_by_type[type_name].append(
                TopicSerializer(topic).data)
        return topics_grouped_by_type

    def get_topics_distributed(self, obj):
        topics_distributed_queryset = Topics.objects.filter(user=obj, status=2)
        topics_distributed_grouped_by_type = {}
        for topic in topics_distributed_queryset:
            type_name = topic.type_topic.name
            if not type_name in topics_distributed_grouped_by_type:
                topics_distributed_grouped_by_type[type_name] = []
            topics_distributed_grouped_by_type[type_name].append(
                TopicSerializer(topic).data)
        return topics_distributed_grouped_by_type


class LogsSerialuzer(serializers.ModelSerializer):

    class Meta:
        model = Logs
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user_from__str'] = str(instance.user_from)
        representation['user_to__str'] = str(instance.user_to)
        representation['avatar__from'] = str(instance.user_from.avatar)
        representation['avatar__to'] = str(instance.user_to.avatar)
        representation['topic__str'] = str(instance.topic.name)
        representation['topic'] = instance.topic.id

        representation['date_action'] = instance.date_action.strftime(
            "%d.%m.%Y")
        representation['action__str'] = str(instance.action)
        return representation


class DirectionTraningSerialuzer(serializers.ModelSerializer):
    class Meta:
        model = DirectionTraning
        fields = '__all__'


class TypeTopicSerialuzer(serializers.ModelSerializer):
    class Meta:
        model = TypesTopic
        fields = '__all__'
