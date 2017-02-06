import string

import demjson
import rrd_helper
import time
import datetime
from django.core.cache import cache
from models import Host, HostThreshold, IpPacket, DeviceInfo
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
                if value['is_in_rrd']:
                    metrics_save_into_rrd(host, key, value)
                if key == 'ip_test':
                    save_ip_packet(host, value)


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



def save_ip_packet(host, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    db_host = Host.objects.get(hostname=hostname)

    value_list = metric['value']

    for value in value_list:
        ip_time = value['time'] if 'time' in value else None
        ip_time = string.atof(ip_time)
        ip_time = datetime.datetime.fromtimestamp(ip_time, tz=timezone('Asia/Shanghai'))

        ip_packet = IpPacket.objects.create(host=db_host,
                                            time=ip_time,
                                            app_name=value['app_name'],
                                            send_port=value['port'],
                                            recv_ip=value['recv_ip'],
                                            recv_port=value['recv_port'])
        ip_packet.save()