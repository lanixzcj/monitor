# -*- coding: UTF-8 -*-
import string
import demjson
import rrd_helper
import datetime
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
                    alarm(value, value)
                if value['is_in_rrd']:
                    metrics_save_into_rrd(host, key, value)
                if key == 'net_pack':
                    save_ip_packet(host, value)
                if key == 'process_info':
                    save_process_packet(host, value)
                if key == 'cpu_info':
                    save_cpu_packet(host, value)


# 记录在线主机列表
def hostinfo_save_into_cache(host, ip):
    hostname = host['hostname'] if 'hostname' in host else None
    # ip = host['ip'] if 'ip' in host else None
    mac_address = host['mac_address'].strip() if 'mac_address' in host else None
    localtime = host['localtime'] if 'localtime' in host else None

    hosts = cache.get('alive_hosts', dict())
    if hostname and (hostname not in hosts):
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
                                        recv_mac_address=value[u'des_MAC'],
                                        send_ip=value[u'source_IP'],
                                        send_port=value[u'source_port'],
                                        recv_ip=value[u'des_IP'],
                                        recv_port=value[u'des_port'])
    ip_packet.save()


# 保存网络包到数据库
def save_process_packet(host, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    db_host = Host.objects.get(hostname=hostname)

    value = metric[u'value']

    time = value[u'time'] if u'time' in value else None
    time = string.atof(time)
    time = datetime.datetime.fromtimestamp(time, tz=timezone('Asia/Shanghai'))
    fields = ('id', 'time', 'host', 'command', 'process_id', 'user', 'boottime',
              'runtime', 'state', 'cpu_used', 'mem_used')
    ip_packet = IpPacket.objects.create(host=db_host,
                                        time=time,
                                        command=value[u'command'],
                                        propcess_id=value[u'pid'],
                                        state=value[u'state'],
                                        cpu_used=value[u'cpu_usage'],
                                        mem_usage=value[u'mem_usage'],
                                        boottime=value[u'launch_time'],
                                        runtime=value[u'running_time']),
    ip_packet.save()


# 保存cpu信息
def save_cpu_packet(host, metric):
    cpu_info = metric[u'value']

    idle = cpu_info['cpu_idle']
    alarm('cpu_usage', 1-idle)
    for key, value in cpu_info.items():
        metrics_save_into_rrd(host, key, value)


def alarm(type, value):
    pass