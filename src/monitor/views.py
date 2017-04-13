# -*- coding: UTF-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import rrd_helper
import time
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from models import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
import demjson
from django.conf import settings
import monitor_view
import strategy_view
from pprint import pprint
from data_process import judge
from django.core.mail import EmailMultiAlternatives
from django.template import loader


def get_user(request):
    host = {
        'mac_address': 's',
        'hostname': 'can',
        'ip': 'sss'
    }
    # judge(host, 'cpu_usage', 99)
    html_content = loader.render_to_string('email.html')

    # msg = EmailMultiAlternatives('Subject here',
    #     html_content,
    #     'monitor_platform@163.com',
    #     ['494651913@qq.com'])
    # msg.content_subtype = "html"
    # msg.send()
    print html_content
    user = {
        'user': str(request.user),
        'isAuthenticated': bool(request.user.is_authenticated)
    }
    response = HttpResponse(content=demjson.encode(user))

    return response


def host_list():
    start = time.time()
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

    print time.time() - start, 'ss'
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
            return Response(status=status.HTTP_404_NOT_FOUND)


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


@csrf_exempt
def strategy_data(request, strategy_type, host):
    if hasattr(strategy_view, strategy_type):
        return getattr(strategy_view, strategy_type)(request, host)

    return HttpResponse()


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
    image_data = rrd_helper.graph_rrd(host, metric_name, time_range, size)
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