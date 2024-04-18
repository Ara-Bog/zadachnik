from rest_framework import serializers
from .models import *


class CustomUserSerializer(serializers.ModelSerializer):
    direction_traning = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['name', 'surename', 'midname', 'is_teacher',
                  'id', 'email', 'discription', 'avatar', 'group', 'direction_traning']

    def get_direction_traning(self, obj):
        return str(obj.group.direction_traning) if obj.group else None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['group'] = str(
            instance.group) if instance.group else None

        representation['user'] = str(instance)
        return representation


class NotificateShortSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    topic_id = serializers.SerializerMethodField()

    class Meta:
        model = Logs
        fields = ['__all__']

    def get_avatar(self, obj):
        return str(obj.user_from.avatar)

    def get_topic_id(self, obj):
        return str(obj.topic_id)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user_from'] = str(instance.user_from)
        representation['topic'] = str(instance.topic.name)

        return representation


class TagsField(serializers.Field):
    def to_representation(self, value):
        return value

    def to_internal_value(self, data):
        return data


class TopicsCardSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    tags = TagsField(source="get_tags")

    class Meta:
        model = Topics
        fields = ['name', 'date_create', 'discription',
                  'id', 'avatar', 'tags', 'user', 'direction_traning']

    def get_avatar(self, obj):
        return str(obj.user.avatar)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = instance.tags.names()
        representation['date_create'] = instance.date_create.strftime(
            "%d.%m.%Y")
        representation['user'] = str(instance.user)
        representation['direction_traning'] = str(instance.direction_traning)
        return representation


class TopicSerializer(serializers.ModelSerializer):
    tags = TagsField(source="get_tags")

    class Meta:
        model = Topics
        fields = '__all__'

    def get_date_create(self, obj):
        return obj.date_create.strftime("%d.%m.%Y")

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
        representation['direction_traning'] = str(instance.direction_traning)
        representation['type_topic'] = str(instance.type_topic)
        representation['status'] = str(instance.status)
        return representation


class TeachersCardTopics(serializers.ModelSerializer):
    topics_data = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.direction_traning = kwargs.pop('direction_traning')
        self.type_topic = kwargs.pop('type_topic')
        super(TeachersCardTopics, self).__init__(*args, **kwargs)

    class Meta:
        model = CustomUser
        fields = ['discription', 'id',
                  'topics_data', 'user', 'avatar']

    def get_user(self, obj):
        return str(obj)

    def get_topics_data(self, obj):
        return TopicSerializer(Topics.objects.filter(user=obj, direction_traning=self.direction_traning, type_topic=self.type_topic, status=Statuses.objects.get(id=1)), many=True).data


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
        representation['user_from'] = str(instance.user_from)
        representation['avatar'] = str(instance.user_from.avatar)
        representation['topic'] = str(instance.topic.name)
        representation['topic_id'] = instance.topic.id

        representation['date_action'] = instance.date_action.strftime(
            "%d.%m.%Y")
        representation['action'] = str(instance.action)
        return representation
