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


@shared_task
def server_thread():
    addr = '', 8650
    server = ThreadingTCPServer(addr, MyStreamRequestHandler)
    server.daemon_threads = True
    server.serve_forever()


@shared_task
def clean_up():
    hosts = cache.get('alive_host', dict())

    print hosts
    for mac_address, host in hosts.items():
        if (time.time() - host['last']) > 40:
            del hosts[mac_address]

    cache.set('alive_host', hosts, 300)


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
            for snd, rcv in ans:
                mac_address = rcv.sprintf("%Ether.src%").strip()
                if mac_address not in alive_hosts and mac_address != gateway_mac:
                    unsafe_hosts[mac_address] = {}
                    unsafe_hosts[mac_address]['ip'] = rcv.sprintf('%ARP.psrc%').strip()
                    unsafe_hosts[mac_address]['hostname'] = arp_poison.get_hostname(unsafe_hosts[mac_address]['ip'])
                    # arp poison
                    # TODO:用一个用例测试
                    if unsafe_hosts[mac_address]['ip'] == '192.168.1.3':
                        arp_poison.poison_target(arp_poison.gateway_ip, gateway_mac,
                                             unsafe_hosts[mac_address]['ip'], mac_address)

            print unsafe_hosts

            for mac_address in last_unsafe_hosts:
                if mac_address not in unsafe_hosts:
                    #restore

                        pass
                        # arp_poison.restore_target(arp_poison.gateway_ip, gateway_mac,
                        #                          unsafe_hosts[mac_address], mac_address)

            cache.set('last_unsafe_hosts', unsafe_hosts)
            time.sleep(5)


@shared_task
def send_safe_strategy(host, port, **safe_strategy):
    addr = (host, port)

    tcp_client = socket(AF_INET, SOCK_STREAM)
    tcp_client.connect(addr)
    tcp_client.sendall('%s' % demjson.encode(safe_strategy))
    # data = tcp_client.recv(1024)

    # print data

    tcp_client.close()


if __name__ == '__main__':
    # server_thread()
    # clean_up()
    # time.sleep(10)
    # clean_up()
    pass
