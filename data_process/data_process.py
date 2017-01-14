import string

import demjson
import rrd_helper
import time
import datetime
from django.core.cache import cache
from models import Host
from models import IpPacket


def process_json(data, client_address):
    json_dict = demjson.decode(data)

    host = json_dict['host'] if 'host' in json_dict else None
    print host
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
    localtime = host['localtime'] if 'localtime' in host else None

    hosts = cache.get('hosts', dict())
    if hostname and (hostname not in hosts):
        hosts[hostname] = {}

    hosts[hostname]['last'] = localtime
    hosts[hostname]['ip'] = ip

    cache.set('hosts', hosts, 300)


def hostinfo_save_into_db(host, ip):
    hostname = host['hostname'] if 'hostname' in host else None
    boottime = host['boottime'] if 'boottime' in host else None
    boottime = string.atof(boottime)
    db_host = Host.objects.get_or_create(hostname=hostname, defaults={
        'ip': ip,
        'last_boottime': datetime.datetime.fromtimestamp(boottime)
    })
    db_host[0].ip = ip
    db_host[0].last_boottime = datetime.datetime.fromtimestamp(boottime)
    db_host[0].save()


def metrics_save_into_rrd(host, name, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    localtime = host['localtime'] if 'localtime' in host else None

    rrd_helper.write_to_rrd(str(hostname), str(name), str(metric['value']), 1, 'GAUGE',
                            '20', str(localtime))


def save_ip_packet(host, metric):
    hostname = host['hostname'] if 'hostname' in host else None
    db_host = Host.objects.get(hostname=hostname)

    value_list = metric['value']

    for value in value_list:
        ip_time = value['time'] if 'time' in value else None
        ip_time = string.atof(ip_time)

        ip_packet = IpPacket.objects.create(host=db_host,
                                            time=datetime.datetime.fromtimestamp(ip_time),
                                            app_name=value['app_name'],
                                            send_port=value['port'],
                                            recv_ip=value['recv_ip'],
                                            recv_port=value['recv_port'])
        ip_packet.save()