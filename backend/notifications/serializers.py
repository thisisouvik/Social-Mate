from rest_framework import serializers

from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor_id = serializers.UUIDField(source='actor.id', read_only=True)
    actor_username = serializers.CharField(source='actor.username', read_only=True)
    actor_display_name = serializers.CharField(source='actor.display_name', read_only=True)
    actor_avatar_url = serializers.CharField(source='actor.avatar_url', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'actor_id',
            'actor_username',
            'actor_display_name',
            'actor_avatar_url',
            'post',
            'notification_type',
            'message',
            'is_read',
            'created_at',
        ]
        read_only_fields = fields
