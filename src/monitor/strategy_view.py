# -*- coding: UTF-8 -*-
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from models import *
from django.views.decorators.csrf import csrf_exempt
import demjson
from django.conf import settings
from rest_framework.renderers import JSONRenderer
from tasks import send_safe_strategy
from django.conf import settings


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


@csrf_exempt
def device(request, host):
    try:
        host_info = Host.objects.get(hostname=host)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        threshold = host_info.hostthreshold
        device = host_info.deviceinfo
    except ObjectDoesNotExist:
        threshold = HostThreshold(hostname=host_info)
        threshold.save()
        device = DeviceInfo(hostname=host_info)
        device.save()
    if request.method == "GET":
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

        return HttpResponse(demjson.encode(threshold_info), status=status.HTTP_200_OK)

    elif request.method == "POST":
        threshold_changed = demjson.decode(request.body)['threshold']
        disk_used = threshold_changed.get('disk_used', 0)
        cpu_used = threshold_changed.get('cpu_used', 0)
        mem_used = threshold_changed.get('mem_used', 0)
        bytes_in = threshold_changed.get('bytes_in', 0)
        bytes_out = threshold_changed.get('bytes_out', 0)
        threshold.disk_used = disk_used
        threshold.cpu_used = cpu_used
        threshold.mem_used = mem_used
        threshold.bytes_in = bytes_in
        threshold.bytes_out = bytes_out
        threshold.save()
        threshold_changed['bytes_in_max'] = settings.BYTES_IN
        threshold_changed['bytes_out_max'] = settings.BYTES_OUT
        threshold_changed['disk_total'] = device.disk_total
        threshold_changed['mem_total'] = device.mem_total

        return HttpResponse(demjson.encode(threshold_changed), status=status.HTTP_200_OK)


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
            if IpPacketsRules.objects.filter(host=host_info, rule_chain=rule, ip=ip).count() > 0:
                return Response(data=u'已添加该策略', status=status.HTTP_400_BAD_REQUEST)
            ip_packets = IpPacketsRules.objects.create(host=host_info,
                                                       rule_chain=rule, ip=ip)
            ip_packets.save()

            ip_packets_info = get_ippackets_rules(request, host)
            send_safe_strategy.delay(host_info.ip, settings.CLIENT_PORT, net=ip_packets_info)
            return JSONResponse(ip_packets_info, status=status.HTTP_201_CREATED)
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
                ip_packets_info = get_ippackets_rules(request, host)
                send_safe_strategy.delay(host_info.ip, settings.CLIENT_PORT, net=ip_packets_info)
            return JSONResponse(ip_packets_info, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


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

            file_rule = get_file_rules(request, host)
            send_safe_strategy.delay(host_info.ip, settings.CLIENT_PORT, file=file_rule)

            return JSONResponse(file_rule, status=status.HTTP_201_CREATED)
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

            file_rule = get_file_rules(request, host)
            send_safe_strategy.delay(host_info.ip, settings.CLIENT_PORT, file=file_rule)

            return JSONResponse(file_rule, status=status.HTTP_200_OK)
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