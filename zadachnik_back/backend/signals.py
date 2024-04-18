from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Logs


@receiver(post_save, sender=Logs)
def notification_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            str(instance.user_to.id),
            {
                "type": "send_notification",
                "user_from": str(instance.user_from),
                "avatar": str(instance.user_from.avatar),
                "data_created": instance.date_action.strftime(
                    "%d.%m.%Y"),
                "topic": str(instance.topic.name),
                "topic_id": instance.topic.id,
                "type_topic": instance.topic.type_topic.id,
                'action': str(instance.action),
            }
        )
