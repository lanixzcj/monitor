# -*- coding: UTF-8 -*-
from celery import shared_task
from celery import Celery
import data_process
from SocketServer import ThreadingTCPServer, StreamRequestHandler
from socket import *
from django.core.cache import cache
import traceback
import time
import demjson
from scapy.layers.l2 import *
import arp_poison
from data_mining.execute import execute
from data_mining.apriorifunc import apriori
from data_mining.genefunc import genefunc
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template import loader


class MyStreamRequestHandler(StreamRequestHandler):
    def handle(self):
        total_data = ""
        while True:
            try:
                data = self.rfile.read(1024)
                total_data += data
                if not data:
                    # print "receive from (%s):%s" % (self.client_address, total_data)
                    data_process.process_json(total_data, self.client_address)
                    break

            except:
                traceback.print_exc()
                break


# 监听县城
@shared_task
def server_thread():
    addr = '', 8650
    server = ThreadingTCPServer(addr, MyStreamRequestHandler)
    server.daemon_threads = True
    server.serve_forever()


# 清理任务
@shared_task
def clean_up():
    hosts = cache.get('alive_hosts', dict())

    print 'alive_hosts', hosts
    for mac_address, host in hosts.items():
        if (time.time() - host['last']) > 40:
            del hosts[mac_address]

    cache.set('alive_hosts', hosts, 300)


# 扫描网段任务
@shared_task
def scanning_host():
    start = time.time()

    ipscan = arp_poison.gateway_ip + '/24'
    try:
        ans, unans = srp(Ether(dst="FF:FF:FF:FF:FF:FF") / ARP(pdst=ipscan), timeout=2, verbose=False)
    except Exception, e:
        print str(e)
    else:
        gateway_mac = arp_poison.get_mac(arp_poison.gateway_ip)
        if gateway_mac is None:
            print "Can't get gateway mac address."
            return
        while True:
            if time.time() - start > 15:
                break

            last_unsafe_hosts = cache.get('last_unsafe_hosts', dict())
            alive_hosts = cache.get('alive_host', dict())
            unsafe_hosts = {}

            print len(ans)
            for snd, rcv in ans:
                mac_address = rcv.sprintf("%Ether.src%").strip()
                if mac_address not in alive_hosts and mac_address != gateway_mac:
                    unsafe_hosts[mac_address] = {}
                    unsafe_hosts[mac_address]['ip'] = rcv.sprintf('%ARP.psrc%').strip()
                    # TODO:可能无法获得hostname
                    # unsafe_hosts[mac_address]['hostname'] = arp_poison.get_hostname(unsafe_hosts[mac_address]['ip'])
                    # arp poison
                    # TODO:用一个用例测试
                    if unsafe_hosts[mac_address]['ip'] == '192.168.1.3':
                        arp_poison.poison_target(arp_poison.gateway_ip, gateway_mac,
                                             unsafe_hosts[mac_address]['ip'], mac_address)

            # print unsafe_hosts

            for mac_address in last_unsafe_hosts:
                if mac_address not in unsafe_hosts:
                    #restore

                        pass
                        # arp_poison.restore_target(arp_poison.gateway_ip, gateway_mac,
                        #                          unsafe_hosts[mac_address], mac_address)

            cache.set('last_unsafe_hosts', unsafe_hosts)
            time.sleep(5)


@shared_task
def send_safe_strategy(ip, port, **safe_strategy):
    addr = (ip, port)

    print safe_strategy, ip, port
    tcp_client = socket.socket(AF_INET, SOCK_STREAM)
    tcp_client.settimeout(10)

    try:
        tcp_client.connect(addr)
        tcp_client.sendall('%s' % demjson.encode(safe_strategy))
        print 'send strategy succeed'
    except (KeyboardInterrupt, SystemExit):
        raise
    except socket.timeout:
        print 'send strategy timeout.'
    except:
        traceback.print_exc()

    tcp_client.close()


# 挖掘任务
# @shared_task
# def data_mining():
#     execute()
#     genefunc()
#     apriori()


# 发送预警邮件
@shared_task
def send_email():
    alarm_info = cache.get('alarm_info', dict())

    for mac_address, alarm in alarm_info.items():
        mac = mac_address
        hostname = alarm['hostname']
        ip = alarm['ip']
        queue = alarm['alarm_queue']

        try:
            html_content = loader.render_to_string('email.html', context={
                'hostname': hostname,
                'IP': ip,
                'MAC': mac,
                'alarm_info': queue
            })
        except:
            traceback.print_exc()

        msg = EmailMultiAlternatives('预警邮件',
                                     html_content,
                                     'monitor_platform@163.com',
                                     ['494651913@qq.com'])
        msg.content_subtype = "html"
        msg.send()

    cache.set('alarm_info', dict())

if __name__ == '__main__':
    # server_thread()
    # clean_up()
    # time.sleep(10)
    # clean_up()
    pass
