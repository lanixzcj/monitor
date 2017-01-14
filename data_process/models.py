from __future__ import unicode_literals

from django.db import models
from django.utils import timezone

# Create your models here.


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