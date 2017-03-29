from django.contrib import admin
from models import *


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