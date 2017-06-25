import string

from django.http import HttpResponse
import time
import datetime
from django.core.exceptions import ObjectDoesNotExist
from models import *
from rest_framework.renderers import JSONRenderer
from pytz import timezone
import pymysql


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


def get_monitor_json(type, host, start, results, page):
    try:
        count = class_dict[type][0].objects.filter(host__hostname=host,
                                                time__gt=datetime.datetime.fromtimestamp(
                                                                  time.time() - start[0],
                                                                  tz=timezone('Asia/Shanghai'))).count()
        data = class_dict[type][0].objects.filter(host__hostname=host,
                            time__gt=datetime.datetime.fromtimestamp(
                                  time.time() - start[0],
                                  tz=timezone('Asia/Shanghai')))[(page - 1) * results:page * results]
        serializer = class_dict[type][1](data, many=True)
        return [serializer.data, count]
    except ObjectDoesNotExist:
        return []


def ip_packet(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('ip_packet', host, start, results, page))


def fileinfo(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('fileinfo', host, start, results, page))


def processinfo(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('processinfo', host, start, results, page))


def mediainfo(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('mediainfo', host, start, results, page))


def warninginfo(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    if request.method == 'GET':
        return JSONResponse(get_monitor_json('warninginfo', host, start, results, page))


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


def warning_mining_info(request, host, start):
    conn = pymysql.connect(host='localhost', db='supervision', user='root', passwd='root', port=3306, charset='utf8')

    type = request.GET.get('type', 1)
    keys = ['id', 'userid', 'time', 'description', 'rank', 'species']
    result = {}
    try:
        with conn.cursor() as cursor:
            sql = 'select id, userid, time, description, rank, species from warning_information_result ' \
                  'where type = %s'
            cursor.execute(sql, type)
            association = cursor.fetchall()
            result['association'] = [dict(zip(keys, a)) for a in association]

            sql = 'select id, userid, time, description, rank, species from warning_information_generules ' \
                  'where fit > 0'
            cursor.execute(sql)
            frequent = cursor.fetchall()
            result['frequent'] = [dict(zip(keys, f)) for f in frequent]
    finally:
        conn.close()

    return JSONResponse(result)


def process_res_info(request, host, start):
    conn = pymysql.connect(host='localhost', db='supervision', user='root', passwd='root', port=3306, charset='utf8')

    type = request.GET.get('type', 1)
    keys = ['id', 'user', 'time', 'process_name', 'resource_name', 'warning_rank']
    result = {}
    try:
        with conn.cursor() as cursor:
            sql = 'select id, user, time, process_name, resource_name, warning_rank from ' \
                  'data_process_resource_warning_result where type = %s'
            cursor.execute(sql, type)
            association = cursor.fetchall()
            result['association'] = [dict(zip(keys, a)) for a in association]

            sql = 'select id, user, time, process_name, resource_name, warning_rank from ' \
                  'data_process_resource_warning_generules where fit > 0'
            cursor.execute(sql)
            frequent = cursor.fetchall()
            result['frequent'] = [dict(zip(keys, f)) for f in frequent]
    finally:
        conn.close()

    return JSONResponse(result)


def all(request, host, start):
    results = string.atof(request.GET.get('results', 10))
    page = string.atof(request.GET.get('page', 1))
    all = {
        'ip_packet': get_monitor_json('ip_packet', host, start, results, page),
        'mediainfo': get_monitor_json('mediainfo', host, start, results, page),
        'processinfo': get_monitor_json('processinfo', host, start, results, page),
        'fileinfo': get_monitor_json('fileinfo', host, start, results, page),
        'warninginfo': get_monitor_json('warninginfo', host, start, results, page),
        'deviceinfo': get_deviceinfo(request, host),
    }

    return JSONResponse(all)
