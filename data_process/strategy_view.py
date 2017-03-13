from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

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


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


def get_ippackets_rules(request, host):
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
    return ip_packets_info


@csrf_exempt
@api_view(['GET', 'POST', 'DELETE'])
def ip_packet(request, host):
    if request.method == 'POST':
        strategy = demjson.decode(request.body)
        rule = strategy['rule']
        ip = strategy['ip']
        try:
            host_info = Host.objects.get(hostname=host)
            ip_packets = IpPacketsRules.objects.create(host=host_info,
                                                       rule_chain=rule, ip=ip)
            ip_packets.save()

            return JSONResponse(get_ippackets_rules(request, host), status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        data = demjson.decode(request.body)

        try:
            host_info = Host.objects.get(hostname=host)
            for id in data:
                ip_packets = IpPacketsRules.objects.filter(host__exact=host_info,
                                                           id=id)
                ip_packets.delete()
            return JSONResponse(get_ippackets_rules(request, host), status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)





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


@csrf_exempt
@api_view(['GET', 'POST', 'DELETE'])
def file(request, host):
    if request.method == 'POST':
        strategy = demjson.decode(request.body)
        file_name = strategy['file']
        permission = strategy['permission']
        try:
            host_info = Host.objects.get(hostname=host)
            file_rule = FileRules.objects.create(host=host_info,
                                                 file=file_name,
                                                 permission=permission)
            file_rule.save()

            return JSONResponse(get_file_rules(request, host), status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        data = demjson.decode(request.body)

        try:
            host_info = Host.objects.get(hostname=host)
            for id in data:
                file_rules = FileRules.objects.filter(host__exact=host_info,
                                                           id=id)
                file_rules.delete()
            return JSONResponse(get_file_rules(request, host), status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


def get_file_rules(request, host):
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
    return files_info


def get_device_rules(request, host):
    try:
        host_info = Host.objects.get(hostname=host)
    except ObjectDoesNotExist:
        return []

    try:
        threshold = host_info.hostthreshold
        device = host_info.deviceinfo
    except ObjectDoesNotExist:
        threshold = HostThreshold(hostname=host_info)
        threshold.save()
        device = DeviceInfo(hostname=host_info)
        device.save()

    threshold_info = {}
    threshold_info['bytes_in'] = threshold.bytes_in
    threshold_info['bytes_in_max'] = settings.BYTES_IN
    threshold_info['bytes_out'] = threshold.bytes_out
    threshold_info['bytes_out_max'] = settings.BYTES_OUT
    threshold_info['cpu_used'] = threshold.cpu_used
    threshold_info['mem_used'] = threshold.mem_used
    threshold_info['disk_used'] = threshold.disk_used
    threshold_info['disk_total'] = device.disk_total
    threshold_info['mem_total'] = device.mem_total

    threshold_json = demjson.encode(threshold_info)
    return threshold_info


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


fun_dict = {
    'ip_packet': get_ippackets_rules,
    'device': get_device_rules,
    'files': get_file_rules,
}


def all(request, host):
    all = {
        'ip_packet': get_ippackets_rules(request, host),
        'device': get_device_rules(request, host),
        'files': get_file_rules(request, host),
    }
    return JSONResponse(all)