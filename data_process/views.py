# -*- coding: UTF-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

import rrd_helper
import time
import datetime
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from models import Host, TrustHost, DeviceInfo, HostThreshold, \
    ProcessInfo, IpPacket, FileInfo, MediaInfo, WarningHistory, IpPacketsRules, \
    FileRules, IpPacketSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
import demjson
from tasks import send_safe_strategy
from django.conf import settings
import monitor_view
import socket
from pytz import timezone
from django.core.mail import send_mail


# Create your views here.
def test(request):
    list = []
    list.append({
        "id": 7,
        "title": "test",
        "desc": "ss",
        "date": "2016-04-17"
    })

    response = HttpResponse(content=demjson.encode(list))

    return response


def host_list():
    alive_hosts = cache.get('alive_hosts', dict())
    unsafe_hosts = cache.get('last_unsafe_hosts', dict())
    trust_hosts = TrustHost.objects.all()

    # 获取数据hosts
    hosts = {}
    for e in Host.objects.all():
        hosts[e.mac_address] = {}
        hosts[e.mac_address]['ip'] = e.ip
        hosts[e.mac_address]['hostname'] = e.hostname
        hosts[e.mac_address]['boottime'] = e.last_boottime.strftime("%Y-%m-%d %H:%M:%S")
        hosts[e.mac_address]['stat'] = '2offline'
        hosts[e.mac_address]['is_trusted'] = False

        if e.mac_address in alive_hosts:
            hosts[e.mac_address]['stat'] = '1online'

    # 获取未安装客户端并在线的hosts
    for mac_address, host in unsafe_hosts.items():
        if mac_address not in alive_hosts:
            if mac_address not in hosts:
                hosts[mac_address] = {}
            hosts[mac_address]['ip'] = host['ip']
            # TODO: 局域网内获得主机名均为localhost
            if 'hostname' not in hosts[mac_address]:
                pass
                # hosts[mac_address]['hostname'] = host['hostname']
            hosts[mac_address]['stat'] = '0unsafe'
            hosts[mac_address]['is_trusted'] = False

    # 是否在信任列表里
    for e in trust_hosts:
        if e.mac_address in hosts:
            hosts[e.mac_address]['is_trusted'] = True
            if hosts[e.mac_address]['stat'] == '0unsafe':
                hosts[e.mac_address]['stat'] = '1online'

    # hosts = Host.objects.all().values()
    sorted_host = sorted(hosts.iteritems(), key=lambda item: item[1]['stat'])

    hosts_list = []
    for item in sorted_host:
        host = dict(dict(mac_address=item[0]), **item[1])
        hosts_list.append(host)

    return hosts_list


def home_host_info(request):
    return HttpResponse(content=demjson.encode(host_list()))


@csrf_exempt
@api_view(['GET', 'POST', 'DELETE'])
def trusted_hosts(request):
    if request.method == 'POST':
        mac_address = demjson.decode(request.body)['mac']
        trust_host = TrustHost.objects.get_or_create(mac_address=mac_address)
        trust_host[0].save()
        return Response(host_list(), status=status.HTTP_201_CREATED)
    elif request.method == 'DELETE':
        try:
            mac_address = demjson.decode(request.body)['mac']
            trust_host = TrustHost.objects.get(mac_address=mac_address)
            trust_host.delete()
            print host_list()
            return Response(host_list(), status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(host_list(), status=status.HTTP_404_NOT_FOUND)


def home(request):
    # send_mail('测试', '该主机数据超过阀值', 'monitor_platform@163.com',
    #           ['494651913@qq.com'], fail_silently=False)
    alive_hosts = cache.get('alive_hosts', dict())
    print alive_hosts
    unsafe_hosts = cache.get('last_unsafe_ho1sts', dict())
    print unsafe_hosts
    if request.method == "POST" and request.is_ajax:
        mac = request.POST.get('mac_address')
        method = request.POST.get('method')

        if method == 'add':
            trust_host = TrustHost.objects.get_or_create(mac_address=mac)
            trust_host[0].save()

            if mac in alive_hosts or mac in unsafe_hosts:
                stat = 'online'
            else:
                stat = 'offline'
            method = 'remove'
        elif method == 'remove':
            try:
                trust_host = TrustHost.objects.get(mac_address=mac)
                trust_host.delete()
            except ObjectDoesNotExist:
                pass

            if mac in alive_hosts:
                stat = 'online'
            elif mac in unsafe_hosts:
                stat = 'unsafe'
            else:
                stat = 'offline'
            method = 'add'

        content = mac + '&' + method + '&' + stat

        return HttpResponse(content=content)

    trust_hosts = TrustHost.objects.all()

    # 获取数据hosts
    hosts = {}
    for e in Host.objects.all():
        hosts[e.mac_address] = {}
        hosts[e.mac_address]['ip'] = e.ip
        hosts[e.mac_address]['hostname'] = e.hostname
        hosts[e.mac_address]['boottime'] = e.last_boottime.strftime("%Y-%m-%d %H:%M:%S")
        hosts[e.mac_address]['stat'] = '2offline'
        hosts[e.mac_address]['is_trusted'] = False

        if e.mac_address in alive_hosts:
            hosts[e.mac_address]['stat'] = '1online'

    # 获取未安装客户端并在线的hosts
    for mac_address, host in unsafe_hosts.items():
        if mac_address not in alive_hosts:
            if mac_address not in hosts:
                hosts[mac_address] = {}
            hosts[mac_address]['ip'] = host['ip']
            # TODO: 局域网内获得主机名均为localhost
            if 'hostname' not in hosts[mac_address]:
                pass
                # hosts[mac_address]['hostname'] = host['hostname']
            hosts[mac_address]['stat'] = '0unsafe'
            hosts[mac_address]['is_trusted'] = False

    # 是否在信任列表里
    for e in trust_hosts:
        if e.mac_address in hosts:
            hosts[e.mac_address]['is_trusted'] = True
            if hosts[e.mac_address]['stat'] == '0unsafe':
                hosts[e.mac_address]['stat'] = '1online'

    # hosts = Host.objects.all().values()
    sorted_host = sorted(hosts.iteritems(), key=lambda item: item[1]['stat'])

    context = {
        'hosts': sorted_host,
    }

    # send_safe_strategy.delay("127.0.0.1", 8649, net='192.168.1.120', cpu=60)
    return render(request, 'data_process/homepage.html', context)


def monitor_data(request, monitor_type, host):
    if hasattr(monitor_view, monitor_type):
        time_dict = settings.TIME_RANGE

        if request.method == 'GET':
            time_range = request.GET.get('r', '')
            if time_range in time_dict:
                start = time_dict[time_range]
            else:
                start = time_dict['hour']
        return getattr(monitor_view, monitor_type)(request, host, start)

    return HttpResponse()


def get_monitor_data(request, monitor_info):
    if hasattr(monitor_view, monitor_info):
        print monitor_info
        return getattr(monitor_view, monitor_info)(request)

    return HttpResponse()


@csrf_exempt
def strategy_method(request, strategy_method):
    if hasattr(monitor_view, strategy_method):
        print strategy_method
        return getattr(monitor_view, strategy_method)(request)

    return HttpResponse()


def host_graphs(request):
    host = request.GET.get('h')
    time_range = request.GET.get('r', '')

    try:
        host_info = Host.objects.get(hostname=host)
        disk = host_info.deviceinfo
    except ObjectDoesNotExist:
        pass

    disk_info = {}
    if disk is not None:
        disk_info['total'] = disk.disk_total
        disk_info['used'] = disk.disk_total - disk.disk_free
        disk_info['used_per'] = int(disk_info['used'] / disk_info['total'] * 100)

    context = {
        'host': host,
        'disk': disk_info,
        'range': time_range,
    }

    return render(request, 'data_process/host.html', context)


def safe_strategy(request):
    if request.method == "GET":
        host = request.GET.get('h')
    elif request.method == "POST" and request.is_ajax:
        host = request.POST.get('hostname')
        disk_used = request.POST.get('disk_used')
        cpu_used = request.POST.get('cpu_used')
        mem_used = request.POST.get('mem_used')
        bytes_in = request.POST.get('bytes_in')
        bytes_out = request.POST.get('bytes_out')

    try:
        host_info = Host.objects.get(hostname=host)

    except ObjectDoesNotExist:
        print 'bad host.'
        return

    try:
        threshold = host_info.hostthreshold
        device = host_info.deviceinfo
    except ObjectDoesNotExist:
        threshold = HostThreshold(hostname=host_info)
        threshold.save()
        device = DeviceInfo(hostname=host_info)
        device.save()

    if request.method == "POST" and request.is_ajax:
        if threshold is not None:
            threshold.disk_used = disk_used
            threshold.cpu_used = cpu_used
            threshold.mem_used = mem_used
            threshold.bytes_in = bytes_in
            threshold.bytes_out = bytes_out
            threshold.save()

            print threshold
            return HttpResponse(content='saved')

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

    print threshold_info
    context = {
        'host': host,
        'threshold': threshold_info,
    }

    return render(request, 'data_process/safe_strategy.html', context)


def image(request):
    host = request.GET.get('h')
    metric_name = request.GET.get('m')
    time_range = request.GET.get('r')
    size = request.GET.get('s')

    # command2 = '''/usr/bin/rrdtool graph -   --start '-3600s' --end now --width 300 --height 139
    #     --title 'bogon CPU last hour' --upper-limit 100 --lower-limit 0 --vertical-label 'Percent'
    #      --slope-mode   --font LEGEND:7 --rigid
    #      DEF:'cpu_user'='/home/lan/PycharmProjects/server/rrd/lan-VirtualBox/cpu_user.rrd':'sum':AVERAGE
    #      DEF:'cpu_system'='/home/lan/PycharmProjects/server/rrd/lan-VirtualBox/cpu_system.rrd':'sum':AVERAGE
    #      DEF:'cpu_idle'='/home/lan/PycharmProjects/server/rrd/lan-VirtualBox/cpu_idle.rrd':'sum':AVERAGE
    #       DEF:'cpu_wio'='/home/lan/PycharmProjects/server/rrd/lan-VirtualBox/cpu_wio.rrd':'sum':AVERAGE
    #        AREA:'cpu_user'#3333bb:'User\g'
    #         '''
    # print metric_name
    start = time.time()
    image_data = rrd_helper.graph_rrd(host, metric_name, time_range, size)
    print time.time() - start
    # p = subprocess.Popen(command2, shell=True, stdout=subprocess.PIPE)
    # p.wait()
    # image_data = p.communicate()[0]
    return HttpResponse(content=image_data, status=200, content_type='image/jpg')


@csrf_exempt
def login(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    mac_address = request.POST.get('mac_address').strip()

    user = auth.authenticate(username=username, password=password)

    if user is None:
        data = {'result': False}
    else:
        data = {'result': True}
        if user.mac_address == mac_address:
            data['mac_address_match'] = True
            data['permissions'] = list(user.get_all_permissions())
        else:
            data['mac_address_match'] = False

    body = demjson.encode(data)

    return HttpResponse(content=body, status=200)