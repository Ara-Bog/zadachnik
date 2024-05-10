from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import *


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ('email', 'name', 'midname', 'surename',
                    'is_teacher', 'group', 'is_admin')
    search_fields = ('email', 'name', 'surename')
    list_filter = ('is_teacher', 'is_admin',)


@admin.register(Logs)
class LogsAdmin(admin.ModelAdmin):
    model = Logs
    list_display = ('topic_name', 'user_from',
                    'user_to', 'date_action', 'action',)
    search_fields = ('topic',)
    list_filter = ('action',)
    ordering = ('date_action',)
    readonly_fields = ('topic_name',)

    def topic_name(self, obj):
        return obj.topic.name


@admin.register(Topics)
class TopicsAdmin(admin.ModelAdmin):
    model = Logs
    list_display = ('type_topic', 'direction_traning',
                    'name', 'status', 'user', 'date_create')
    list_filter = ('status', 'user', 'type_topic', 'direction_traning')
    search_fields = ('name', 'user')
    ordering = ('date_create',)


@admin.register(Groups)
class GroupsAdmin(admin.ModelAdmin):
    model = Logs
    list_display = ('direction_traning', 'name',)
    list_filter = ('direction_traning',)
    search_fields = ('name',)


admin.site.register(Actions)
admin.site.register(Statuses)
admin.site.register(TypesTopic)
admin.site.register(DirectionTraning)
admin.site.unregister(Group)
