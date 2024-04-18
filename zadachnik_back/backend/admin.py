from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import *


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'name', 'surename', 'midname',
                    'is_teacher', 'group', 'avatar', 'discription', 'is_admin')
    search_fields = ('email', 'name', 'surename')
    ordering = ('email', 'name', 'surename', 'midname', 'is_teacher', 'group')
    list_filter = ('is_teacher', 'group')
    filter_horizontal = ()

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'surename', 'midname',
         'is_teacher', 'group', 'avatar', 'discription')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'name', 'surename', 'midname', 'is_teacher', 'group', 'avatar', 'discription', 'is_admin'),
        }),
    )


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Actions)
admin.site.register(Statuses)
admin.site.register(TypesTopic)
admin.site.register(DirectionTraning)
admin.site.register(Groups)
admin.site.register(Topics)
admin.site.register(Logs)
admin.site.unregister(Group)
