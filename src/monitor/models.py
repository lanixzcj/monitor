from __future__ import unicode_literals

import six
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
# Create your models here.
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers


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


class IpPacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpPacket
        fields = ('time', 'host', 'app_name', 'send_port', 'recv_ip', 'recv_port')


class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessInfo
        fields = ('time', 'host', 'process_name', 'process_id', 'user', 'boottime', 'runtime', 'used_ports')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileInfo
        fields = ('time', 'host', 'file_name', 'user', 'operate_type', 'modify_size')


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaInfo
        fields = ('time', 'host', 'media_name', 'io_type', 'media_size', 'operate_file')


class WarningHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WarningHistory
        fields = ('time', 'host', 'warning_type', 'warning_content', 'warning_level')


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