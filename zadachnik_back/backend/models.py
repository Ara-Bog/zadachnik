from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from taggit.managers import TaggableManager
from datetime import datetime


class Actions(models.Model):

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'

    name = models.CharField(max_length=255, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'


class Statuses(models.Model):

    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'

    name = models.CharField(max_length=255, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'


class DirectionTraning(models.Model):

    class Meta:
        verbose_name = 'Направление подготовки'
        verbose_name_plural = 'Направления подготовки'

    name = models.CharField(max_length=255, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'


class Groups(models.Model):

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'

    name = models.CharField(max_length=255, verbose_name='Название')
    direction_traning = models.ForeignKey(
        DirectionTraning, on_delete=models.PROTECT, verbose_name='Направление подготовки')

    def __str__(self):
        return f'{self.name}'


class TypesTopic(models.Model):

    class Meta:
        verbose_name = 'Тип темы'
        verbose_name_plural = 'Типы тем'

    name = models.CharField(max_length=255, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'


class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, is_teacher=False, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )

        user.is_teacher = is_teacher
        user.set_password(password)
        user.save(using=self.db)

        return user

    def create_superuser(self, email: str, is_teacher=False, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )

        user.is_teacher = is_teacher
        user.is_admin = True
        user.set_password(password)
        user.save(using=self.db)

        return user


class CustomUser(AbstractBaseUser):

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    name = models.CharField(max_length=255, verbose_name='Имя')
    surename = models.CharField(max_length=255, verbose_name='Фамилия')
    midname = models.CharField(
        null=True, blank=True, max_length=255, verbose_name='Отчество')
    discription = models.TextField(
        null=True, blank=True, max_length=255, verbose_name='Описание')
    avatar = models.ImageField(
        null=True, blank=True, upload_to='avatars/', max_length=255, verbose_name='Фото')
    email = models.EmailField(unique=True, verbose_name='Почта')
    is_teacher = models.BooleanField(
        default=False, verbose_name='Преподаватель')
    is_admin = models.BooleanField(default=False)

    group = models.ForeignKey(Groups, null=True, blank=True,
                              on_delete=models.PROTECT, verbose_name='Группа')  # только для студентов
    topic_is_set = models.BooleanField(
        default=False, verbose_name='Тема взята')  # только для студентов

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    REQUIRED_FIELDS = ['name', 'surename']

    def __str__(self):
        return f'{self.surename} {self.name} {f"{self.midname}" if self.midname else ""}'

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class Topics(models.Model):

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'

    user = models.ForeignKey(CustomUser,
                             on_delete=models.CASCADE, verbose_name='Инициатор')
    direction_traning = models.ForeignKey(
        DirectionTraning, on_delete=models.PROTECT, verbose_name='Направление подготовки')
    type_topic = models.ForeignKey(
        TypesTopic, on_delete=models.PROTECT, verbose_name='Тип темы')
    status = models.ForeignKey(
        Statuses, on_delete=models.PROTECT, verbose_name='Статус')
    name = models.CharField(max_length=255, verbose_name='Название')
    discription = models.CharField(
        null=True, blank=True, max_length=500, verbose_name='Описание')
    tags = TaggableManager(blank=True, verbose_name='Теги')
    count_users = models.IntegerField(
        verbose_name='Количество людей на тему', default=1)
    date_create = models.DateTimeField(
        verbose_name='Дата создания', default=datetime.now)

    def get_tags(self):
        """ names() is a django-taggit method, returning a ValuesListQuerySet 
        (basically just an iterable) containing the name of each tag as a string
        """
        return self.tags.names()

    def __str__(self):
        return f'{self.user} {self.name}'


class Logs(models.Model):

    class Meta:
        verbose_name = 'Логи'
        verbose_name_plural = 'Логи'

    topic = models.ForeignKey(
        Topics, on_delete=models.CASCADE, verbose_name='Тема')
    user_from = models.ForeignKey(CustomUser,
                                  on_delete=models.CASCADE,
                                  related_name='logs_from_set',
                                  verbose_name='Действие от')
    user_to = models.ForeignKey(CustomUser,
                                on_delete=models.CASCADE,
                                related_name='logs_to_set',
                                verbose_name='Действие к')
    date_action = models.DateTimeField(
        verbose_name='Дата события', default=datetime.now)
    action = models.ForeignKey(
        Actions, on_delete=models.PROTECT, verbose_name='Событие')
    isChecked = models.BooleanField(
        default=False, verbose_name='Сообщение прочитано')

    def __str__(self):
        return f'По теме {self.topic} от {self.topic.user} - \
            {self.user_from} выполнил {self.action} к {self.user_to}'
