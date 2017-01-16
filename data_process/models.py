from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.


class MyUserManager(BaseUserManager):
    def create_user(self, username, mac_address, password=None):
        if not username:
            raise ValueError('Users must have an email address')

        user = self.model(
            username=username,
            mac_address=mac_address,
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


class Host(models.Model):
    hostname = models.CharField(max_length=30, unique=True)
    ip = models.GenericIPAddressField(default='0.0.0.0')
    mac_address = models.CharField(max_length=30, unique=True)
    last_boottime = models.DateTimeField()


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
