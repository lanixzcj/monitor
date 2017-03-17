from django.contrib import admin
from django import forms
from models import UserAction, DeviceInfo, MediaInfo, FileInfo, HostThreshold,\
    ProcessInfo, IpPacket, TrustHost, WarningHistory, Host, IpPacketsRules, FileRules
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Permission



admin.site.register(UserAction)
admin.site.register(DeviceInfo)
admin.site.register(MediaInfo)
admin.site.register(FileInfo)
admin.site.register(ProcessInfo)
admin.site.register(IpPacket)
admin.site.register(TrustHost)
admin.site.register(WarningHistory)
admin.site.register(Host)
admin.site.register(IpPacketsRules)
admin.site.register(FileRules)
admin.site.register(HostThreshold)