# -*- coding: UTF-8 -*-
import string
import demjson
import rrd_helper
import datetime
import time
from django.core.cache import cache
from models import Host, HostThreshold, IpPacket, DeviceInfo, ProcessInfo
from django.core.exceptions import ObjectDoesNotExist
from pytz import timezone


def process_json(data, client_address):
    json_dict = demjson.decode(data)
    host = json_dict['host'] if 'host' in json_dict else None
    if host:
        hostinfo_save_into_cache(host, client_address[0])
        hostinfo_save_into_db(host, client_address[0])

        metrics = json_dict['metrics'] if 'metrics' in json_dict else None

        if metrics:
            for key, value in metrics.items():
                if key == 'bytes_out' or key == 'bytes_in':
                    judge(host, value, value)
                if value['is_in_rrd']:
                    metrics_save_into_rrd(host, key, value)
                if key == 'net_pack':
                    save_ip_packet(host, value)
                elif key == 'mem_info':
                    save_mem_packet(host, value)
                elif key == 'disk_info':
                    save_disk_packet(host, value)
                elif key == 'process_info':
                    save_process_packet(host, value)
                elif key == 'cpu_info':
                    save_cpu_packet(host, value)


# 记录在线主机列表
def hostinfo_save_into_cache(host, ip):
    hostname = host['hostname'] if 'hostname' in host else None
    # ip = host['ip'] if 'ip' in host else None
    mac_address = host['mac_address'].strip() if 'mac_address' in host else None
    localtime = host['localtime'] if 'localtime' in host else None

    hosts = cache.get('alive_hosts', dict())
    if mac_address and (mac_address not in hosts):
        hosts[mac_address] = {}

    hosts[mac_address]['last'] = localtime
    hosts[mac_address]['ip'] = ip
    hosts[mac_address]['hostname'] = hostname

    cache.set('alive_hosts', hosts, 300)


# 主机存入数据库
def hostinfo_save_into_db(host, ip):
    hostname = host['hostname'] if 'hostname' in host else None
    mac_address = host['mac_address'].strip() if 'mac_address' in host else None
    boottime = host['boottime'] if 'boottime' in host else None
    boottime = string.atof(boottime)

    try:
        db_host = Host.objects.get(hostname=hostname)
        db_host.ip = ip
        db_host.mac_address = mac_address
        db_host.last_boottime = datetime.datetime.fromtimestamp(boottime, tz=timezone('Asia/Shanghai'))
        db_host.save()
    except ObjectDoesNotExist:
        db_host = Host(hostname=hostname, ip=ip, mac_address=mac_address,
                       last_boottime=datetime.datetime.fromtimestamp(boottime, tz=timezone('Asia/Shanghai')))
        db_host.save()
        threshold = HostThreshold(hostname=db_host)
        threshold.save()
        deviceinfo = DeviceInfo(hostname=db_host)
        deviceinfo.save()


# 监控数据存入rrd
def metrics_save_into_rrd(host, name, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    localtime = host['localtime'] if 'localtime' in host else None

    rrd_helper.write_to_rrd(str(hostname), str(name), str(metric['value']), 1, 'GAUGE',
                            '20', str(localtime))

    try:
        db_host = Host.objects.get(hostname=hostname)
        deviceinfo = db_host.deviceinfo
    except ObjectDoesNotExist:
        print 'bad host'
        return

    if name == 'disk_total':
        deviceinfo.disk_total = metric['value']
        deviceinfo.save()
    elif name == 'disk_free':
        deviceinfo.disk_free = metric['value']
        deviceinfo.save()
    elif name == 'mem_total':
        deviceinfo.mem_total = metric['value']
        deviceinfo.save()


# 保存网络包到数据库
def save_ip_packet(host, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    db_host = Host.objects.get(hostname=hostname)

    value = metric[u'value']

    ip_time = value[u'time'] if u'time' in value else None
    ip_time = string.atof(ip_time)
    ip_time = datetime.datetime.fromtimestamp(ip_time, tz=timezone('Asia/Shanghai'))

    ip_packet = IpPacket.objects.create(host=db_host,
                                        time=ip_time,
                                        send_mac_address=value[u'source_MAC'],
                                        recv_mac_address=value[u'des_MAC'])
    ip_packet.send_ip = value[u'source_IP'] if u'source_IP' in value else '0.0.0.0'
    ip_packet.send_port = value[u'source_port'] if u'source_port' in value else 0
    ip_packet.recv_ip = value[u'des_IP'] if u'des_IP' in value else '0.0.0.0'
    ip_packet.recv_port = value[u'des_port'] if u'des_port' in value else 0

    ip_packet.save()


# 保存进程到数据库
def save_process_packet(host, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    db_host = Host.objects.get(hostname=hostname)

    value = metric[u'value']

    # time = value[u'time'] if u'time' in value else None
    # time = string.atof(time)
    # time = datetime.datetime.fromtimestamp(time, tz=timezone('Asia/Shanghai'))

    for process_info in value:
        process = ProcessInfo.objects.create(host=db_host,
                                             command=process_info[u'command'],
                                             propcess_id=process_info[u'pid'],
                                             state=process_info[u'state'],
                                             cpu_used=process_info[u'cpu_usage'],
                                             mem_usage=process_info[u'mem_usage'],
                                             boottime=process_info[u'launch_time'],
                                             runtime=process_info[u'running_time'])
        process.save()


# 保存cpu信息
def save_cpu_packet(host, metric):
    cpu_info = metric[u'value']

    idle = cpu_info['cpu_idle']
    judge(host, 'cpu_usage', 1 - idle)
    for key, value in cpu_info.items():
        metrics_save_into_rrd(host, key, value)


# 保存mem信息
def save_mem_packet(host, metric):
    mem_info = metric[u'value']

    free = mem_info['mem_free']
    total = mem_info['mem_total']
    judge(host, 'mem_usage', total - free)
    for key, value in mem_info.items():
        metrics_save_into_rrd(host, key, value)


# 保存disk信息
def save_disk_packet(host, metric):
    disk_info = metric[u'value']

    free = disk_info['disk_free']
    total = disk_info['disk_total']
    judge(host, 'disk_usage', total - free)
    for key, value in disk_info.items():
        metrics_save_into_rrd(host, key, value)


def judge(host, type, value):
    hostname = host['hostname'] if 'hostname' in host else None
    try:
        host_info = Host.objects.get(hostname=hostname)
    except ObjectDoesNotExist:
        return

    try:
        threshold = host_info.hostthreshold
    except ObjectDoesNotExist:
        threshold = HostThreshold(hostname=host_info)
        threshold.save()

    mac_address = host_info.mac_address
    alarm_info = cache.get('alarm_info', dict())

    if mac_address and (mac_address not in alarm_info):
        alarm_info[mac_address] = {}
        alarm_info[mac_address]['hostname'] = host_info.hostname
        alarm_info[mac_address]['ip'] = host_info.ip
        alarm_info[mac_address]['alarm_queue'] = []

    threshold_dict = {
        'cpu_usage': [threshold.cpu_used, u'CPU', u'cpu使用率超过阈值, 当前值为%s, 阈值为%s'],
        'mem_usage': [threshold.mem_used, u'内存',  u'内存使用率过阈值, 当前值为%s, 阈值为%s'],
        'disk_usage': [threshold.disk_used, u'硬盘' u'硬盘使用超过阈值, 当前值为%s, 阈值为%s'],
        'bytes_in': [threshold.bytes_in, u'网络' u'下载速度超过阈值, 当前值为%s, 阈值为%s'],
        'bytes_out': [threshold.bytes_out, u'网络' u'上传速度超过阈值, 当前值为%s, 阈值为%s'],
    }

    if type in threshold_dict:
        threshold_info = threshold_dict[type]

        if threshold_info[0] != 0 and value > threshold_info[0]:
            alarm_info[mac_address]['alarm_queue'].append({
                'time': time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                'type': threshold_info[1].encode("utf-8"),
                'description': (threshold_info[2] % (value, threshold_info[0])).encode("utf-8"),
            })

    cache.set('alarm_info', alarm_info, 500)
