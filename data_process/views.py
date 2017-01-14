# -*- coding: UTF-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
import rrd_helper
import time
from django.core.cache import cache
from models import Host
from models import IpPacket
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
import demjson
from tasks import send_safe_strategy

# Create your views here.


def home(request):
    # hosts = cache.get('hosts', dict())
    hosts = {}
    for e in Host.objects.all():
        hosts[e.hostname] = {}
        hosts[e.hostname]['ip'] = e.ip
        hosts[e.hostname]['boottime'] = e.last_boottime.strftime("%Y-%m-%d %H:%M:%S")
    # hosts = Host.objects.all().values()
    # print hosts
    time_range = request.GET.get('r', '')
    user = {'is_authenticated': True, 'username': 'lan'}

    # TODO:测试，还没有区分host
    ip_packets = []
    for e in IpPacket.objects.all():
        ip_packet = {}
        ip_packet['app_name'] = e.app_name
        ip_packet['send_port'] = e.send_port
        ip_packet['time'] = e.time.strftime("%Y-%m-%d %H:%M:%S")
        ip_packet['recv_ip'] = e.recv_ip
        ip_packet['recv_port'] = e.recv_port
        ip_packets.append(ip_packet)

    context = {
        # 'user': user
        'hosts': hosts,
        'range': time_range,
        'ip_packets': ip_packets
    }
    send_safe_strategy.delay("127.0.0.1", 8649, net='192.168.1.120', cpu=60)
    return render(request, 'data_process/homepage.html', context)


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

    user = auth.authenticate(username=username, password=password)
    if user is None:
        data = {'result': False}
    else:
        data = {'result': True, 'permissions': list(user.get_all_permissions())}

    body = demjson.encode(data)

    return HttpResponse(content=body, status=200)