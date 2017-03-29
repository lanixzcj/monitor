from django.http import HttpResponse
import time
import datetime
from django.core.exceptions import ObjectDoesNotExist
from models import *
from rest_framework.renderers import JSONRenderer
from pytz import timezone


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class_dict = {
    'ip_packet': [IpPacket, IpPacketSerializer],
    'fileinfo': [FileInfo, FileSerializer],
    'mediainfo': [MediaInfo, MediaSerializer],
    'processinfo': [ProcessInfo, ProcessSerializer],
    'warninginfo': [WarningHistory, WarningHistorySerializer],
}


def get_monitor_json(type, host, start):
    try:
        data = class_dict[type][0].objects.filter(host__hostname=host,
                                                time__gt=datetime.datetime.fromtimestamp(
                                                                  time.time() - start[0],
                                                                  tz=timezone('Asia/Shanghai')))
        serializer = class_dict[type][1](data, many=True)
        return serializer.data
    except ObjectDoesNotExist:
        return []


def ip_packet(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('ip_packet', host, start))


def fileinfo(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('fileinfo', host, start))


def processinfo(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('processinfo', host, start))


def mediainfo(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('mediainfo', host, start))


def warninginfo(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('warninginfo', host, start))


def get_deviceinfo(request, host):
    try:
        host_info = Host.objects.get(hostname=host)
        disk = host_info.deviceinfo

        disk_info = {}
        if disk is not None:
            disk_info['total'] = disk.disk_total
            disk_info['used'] = disk.disk_total - disk.disk_free
            disk_info['used_per'] = int(disk_info['used'] / disk_info['total'] * 100)
        return disk_info
    except ObjectDoesNotExist:
        return {}


def deviceinfo(request, host, start):
    if request.method == 'GET':
        return JSONResponse(get_deviceinfo(request, host))


def all(request, host, start):
    print host
    all = {
        'ip_packet': get_monitor_json('ip_packet', host, start),
        'mediainfo': get_monitor_json('mediainfo', host, start),
        'processinfo': get_monitor_json('processinfo', host, start),
        'fileinfo': get_monitor_json('fileinfo', host, start),
        'warninginfo': get_monitor_json('warninginfo', host, start),
        'deviceinfo': get_deviceinfo(request, host),
    }

    return JSONResponse(all)
