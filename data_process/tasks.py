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
    hosts = cache.get('hosts', dict())

    print hosts
    for hostname, host in hosts.items():
        if (time.time() - host['last']) > 40:
            del hosts[hostname]

    cache.set('hosts', hosts, 300)


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
