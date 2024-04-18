# Generated by Django 5.0.3 on 2024-04-07 15:02

import taggit.managers
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
        ('taggit', '0006_rename_taggeditem_content_type_object_id_taggit_tagg_content_8fc721_idx'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='topic_is_set',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='topics',
            name='discription',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='topics',
            name='tags',
            field=taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Теги'),
        ),
    ]