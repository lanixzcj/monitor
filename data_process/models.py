from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
# Create your models here.
from django.utils.encoding import python_2_unicode_compatible


class MyUserManager(BaseUserManager):
    def create_user(self, username, mac_address, email, tel, password=None):
        if not username:
            raise ValueError('Users must have an username')

        user = self.model(
            username=username,
            mac_address=mac_address,
            email=email,
            tel=tel
        )

        user.is_superuser = False
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        user = self.model(
            username=username,
            mac_address=''
        )

        user.set_password(password)
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField()
    tel = models.CharField(max_length=24)
    mac_address = models.CharField(max_length=24)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class GlobalPermissionManager(models.Manager):
    def get_query_set(self):
        return super(GlobalPermissionManager, self).\
            get_query_set().filter(content_type__model='global_permission')


class GlobalPermission(Permission):
    """A global permission, not attached to a model"""

    objects = GlobalPermissionManager()

    class Meta:
        proxy = True
        verbose_name = "global_permission"

    def save(self, *args, **kwargs):
        ct, created = ContentType.objects.get_or_create(
            model=self._meta.verbose_name, app_label=self._meta.app_label
        )
        self.content_type = ct
        super(GlobalPermission, self).save(*args, **kwargs)


class Host(models.Model):
    hostname = models.CharField(max_length=30, unique=True)
    ip = models.GenericIPAddressField(default='0.0.0.0')
    mac_address = models.CharField(max_length=30, unique=True)
    last_boottime = models.DateTimeField()

    def __unicode__(self):
        return self.hostname


class TrustHost(models.Model):
    mac_address = models.CharField(max_length=30, unique=True)


class DeviceInfo(models.Model):
    hostname = models.OneToOneField(Host, on_delete=models.CASCADE, primary_key=True)
    disk_total = models.FloatField(default=100)
    disk_free = models.FloatField(default=0)
    mem_total = models.FloatField(default=1800000)


class HostThreshold(models.Model):
    hostname = models.OneToOneField(Host, on_delete=models.CASCADE, primary_key=True)
    bytes_in = models.FloatField(default=0)
    bytes_out = models.FloatField(default=0)
    disk_used = models.FloatField(default=0)
    mem_used = models.FloatField(default=0)
    cpu_used = models.FloatField(default=0)


class UserAction(models.Model):
    hostname = models.ForeignKey(Host, on_delete=models.CASCADE)
    user = models.CharField(max_length=30)
    command = models.CharField(max_length=100)
    time = models.DateTimeField()

    def __unicode__(self):
        return self.user


class IpPacket(models.Model):
    time = models.DateTimeField()
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    app_name = models.CharField(max_length=30)
    send_port = models.IntegerField()
    recv_ip = models.GenericIPAddressField(default='0.0.0.0')
    recv_port = models.IntegerField()


class ProcessInfo(models.Model):
    time = models.DateTimeField()
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    process_name = models.CharField(max_length=30)
    process_id = models.IntegerField()
    user = models.CharField(max_length=30)
    boottime = models.DateTimeField()
    runtime = models.DurationField()
    used_ports = models.CharField(max_length=100)

    def __unicode__(self):
        return self.process_name


class FileInfo(models.Model):
    time = models.DateTimeField()
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=100)
    user = models.CharField(max_length=30)
    operate_type = models.CharField(max_length=30)
    modify_size = models.FloatField(default=0)

    def __unicode__(self):
        return self.file_name


class MediaInfo(models.Model):
    time = models.DateTimeField()
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    media_name = models.CharField(max_length=100)
    io_type = models.CharField(max_length=30)
    media_size = models.FloatField(default=0)
    operate_file = models.CharField(max_length=100)

    def __unicode__(self):
        return self.media_name


class WarningHistory(models.Model):
    time = models.DateTimeField()
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    warning_type = models.CharField(max_length=30)
    warning_content = models.CharField(max_length=100)
    warning_level = models.CharField(max_length=30)

    def __unicode__(self):
        return self.warning_type


class IpPacketsRules(models.Model):
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    rule_chain = models.CharField(max_length=30)
    ip = models.GenericIPAddressField(default='0.0.0.0')

    def __unicode__(self):
        return self.rule_chain


class FileRules(models.Model):
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    file = models.CharField(max_length=30)
    permission = models.CharField(max_length=30)

    def __unicode__(self):
        return self.file