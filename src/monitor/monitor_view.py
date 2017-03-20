from django.shortcuts import render
from django.http import HttpResponse
import rrd_helper
import time
import datetime
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from models import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
import demjson
from django.conf import settings
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from pytz import timezone


def get_mediainfo(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]
    else:
        start = time_dict['hour']

    try:
        host_info = Host.objects.get(hostname=host)
        medias = MediaInfo.objects.filter(host__exact=host_info,
                                          time__gt=datetime.datetime.fromtimestamp(time.time() - start[0]))
    except ObjectDoesNotExist:
        pass

    medias_info = []
    for e in medias:
        one_media_info = {}
        one_media_info['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        one_media_info['media_name'] = e.media_name
        one_media_info['media_size'] = e.media_size
        one_media_info['io_type'] = e.io_type
        one_media_info['operate_file'] = e.operate_file
        medias_info.append(one_media_info)

    media_json = demjson.encode(medias_info)
    return HttpResponse(content=media_json)


def get_fileinfo(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]
    else:
        start = time_dict['hour']

    try:
        host_info = Host.objects.get(hostname=host)
        files = FileInfo.objects.filter(host__exact=host_info,
                                          time__gt=datetime.datetime.fromtimestamp(time.time() - start[0]))
    except ObjectDoesNotExist:
        pass

    files_info = []
    for e in files:
        one_file_info = {}
        one_file_info['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        one_file_info['file_name'] = e.file_name
        one_file_info['user'] = e.user
        one_file_info['operate_type'] = e.operate_type
        one_file_info['modify_size'] = e.modify_size
        files_info.append(one_file_info)

    file_json = demjson.encode(files_info)
    return HttpResponse(content=file_json)


def get_processinfo(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]
    else:
        start = time_dict['hour']

    try:
        host_info = Host.objects.get(hostname=host)
        process = ProcessInfo.objects.filter(host__exact=host_info,
                                          time__gt=datetime.datetime.fromtimestamp(time.time() - start[0]))
    except ObjectDoesNotExist:
        pass

    process_info = []
    for e in process:
        one_process_info = {}
        one_process_info['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        one_process_info['process_name'] = e.process_name
        one_process_info['process_id'] = e.process_id
        one_process_info['user'] = e.user
        one_process_info['boottime'] = e.boottime.strftime("%Y-%m-%d %H:%M:%S")
        one_process_info['runtime'] = e.runtime
        one_process_info['used_ports'] = e.used_ports
        process_info.append(one_process_info)

    process_json = demjson.encode(process_info)
    return HttpResponse(content=process_json)


def get_warnings(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]
    else:
        start = time_dict['hour']

    try:
        host_info = Host.objects.get(hostname=host)
        warnings = WarningHistory.objects.filter(host__exact=host_info,
                                          time__gt=datetime.datetime.fromtimestamp(time.time() - start[0]))
    except ObjectDoesNotExist:
        pass

    warnings_info = []
    for e in warnings:
        one_warning_info = {}
        one_warning_info['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        one_warning_info['warning_type'] = e.warning_type
        one_warning_info['warning_content'] = e.warning_content
        one_warning_info['warning_level'] = e.warning_level
        warnings_info.append(one_warning_info)

    warning_json = demjson.encode(warnings_info)
    return HttpResponse(content=warning_json)


def get_ippackets(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]
    else:
        start = time_dict['hour']

    try:
        host_info = Host.objects.get(hostname=host)
        ip_packets = IpPacket.objects.filter(host__exact=host_info,
                                             time__gt=datetime.datetime.fromtimestamp(time.time() - start[0]))
    except ObjectDoesNotExist:
        pass

    ip_packets_info = []
    for e in ip_packets:
        one_ip_packet = {}
        one_ip_packet['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        one_ip_packet['app_name'] = e.app_name
        one_ip_packet['send_port'] = e.send_port
        one_ip_packet['recv_ip'] = e.recv_ip
        one_ip_packet['recv_port'] = e.recv_port
        ip_packets_info.append(one_ip_packet)

    ip_packets_json = demjson.encode(ip_packets_info)
    return HttpResponse(content=ip_packets_json)


def get_ippackets_rules(request):
    host = request.GET.get('h')

    try:
        host_info = Host.objects.get(hostname=host)
        ip_packets = IpPacketsRules.objects.filter(host__exact=host_info)
    except ObjectDoesNotExist:
        pass

    ip_packets_info = []
    for e in ip_packets:
        one_ip_packet = {}
        one_ip_packet['id'] = e.id
        one_ip_packet['rule'] = e.rule_chain
        one_ip_packet['ip'] = e.ip
        ip_packets_info.append(one_ip_packet)

    ip_packets_json = demjson.encode(ip_packets_info)
    return HttpResponse(content=ip_packets_json)


@csrf_exempt
def add_ippackets_rules(request):
    host = request.GET.get('h')
    if request.method == "POST" and request.is_ajax:
        chain = request.POST.get('chain')
        ip = request.POST.get('ip')

    try:
        host_info = Host.objects.get(hostname=host)
        ip_packets = IpPacketsRules.objects.create(host=host_info,
                                                   rule_chain=chain, ip=ip)
        ip_packets.save()

        return HttpResponse('saved')
    except ObjectDoesNotExist:
        pass

    return HttpResponse('failed')


@csrf_exempt
def remove_ippackets_rules(request):
    host = request.GET.get('h')
    datas = demjson.decode(request.body)
    print datas, host

    try:
        host_info = Host.objects.get(hostname=host)
    except ObjectDoesNotExist:
        return HttpResponse('failed')

    for data in datas:
        print data
        try:
            ip_packets = IpPacketsRules.objects.filter(host__exact=host_info,
                                                       ip=data['ip'],
                                                       rule_chain=data['rule'])
            ip_packets.delete()
            pass
        except ObjectDoesNotExist:
            pass

    return HttpResponse('delete')


def get_file_rules(request):
    host = request.GET.get('h')

    try:
        host_info = Host.objects.get(hostname=host)
        files = FileRules.objects.filter(host__exact=host_info)
    except ObjectDoesNotExist:
        pass

    files_info = []
    for e in files:
        one_file = {}
        one_file['id'] = e.id
        one_file['file'] = e.file
        one_file['permission'] = e.permission
        files_info.append(one_file)

    files_json = demjson.encode(files_info)
    return HttpResponse(content=files_json)


@csrf_exempt
def add_file_rules(request):
    host = request.GET.get('h')
    if request.method == "POST" and request.is_ajax:
        file = request.POST.get('file')
        permission = request.POST.get('permission')

    try:
        host_info = Host.objects.get(hostname=host)
        file_rule = FileRules.objects.create(host=host_info,
                                              file=file,
                                              permission=permission)
        file_rule.save()

        return HttpResponse('saved')
    except ObjectDoesNotExist:
        pass

    return HttpResponse('failed')


@csrf_exempt
def remove_file_rules(request):
    host = request.GET.get('h')
    datas = demjson.decode(request.body)
    print datas, host

    try:
        host_info = Host.objects.get(hostname=host)
    except ObjectDoesNotExist:
        return HttpResponse('failed')

    for data in datas:
        print data
        try:
            file_rules = FileRules.objects.filter(host__exact=host_info,
                                                       file=data['file'],
                                                       permission=data['permission'])
            file_rules.delete()
        except ObjectDoesNotExist:
            pass

    return HttpResponse('delete')


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
