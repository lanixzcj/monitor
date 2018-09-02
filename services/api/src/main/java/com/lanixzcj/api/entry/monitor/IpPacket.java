package com.lanixzcj.api.entry.monitor;

import java.io.Serializable;
import java.util.Date;

public class IpPacket implements Serializable {
    private static final long serialVersionUID = -1L;

    private int id;
    private Date time;
    private int host_id;
    private String send_mac_address;
    private String recv_mac_address;
    private String send_ip;
    private int send_port;
    private String recv_ip;
    private int recv_port;

    public IpPacket () {

    }
    public IpPacket(int id, Date time, String send_mac_address, String recv_mac_address, String send_ip, int send_port, String recv_ip, int recv_port, int host_id) {
        this.id = id;
        this.time = time;
        this.host_id = host_id;
        this.send_mac_address = send_mac_address;
        this.recv_mac_address = recv_mac_address;
        this.send_ip = send_ip;
        this.send_port = send_port;
        this.recv_ip = recv_ip;
        this.recv_port = recv_port;
    }

    public IpPacket(Date time, String send_mac_address, String recv_mac_address, String send_ip, int send_port, String recv_ip, int recv_port) {
        this.time = time;
        this.send_mac_address = send_mac_address;
        this.recv_mac_address = recv_mac_address;
        this.send_ip = send_ip;
        this.send_port = send_port;
        this.recv_ip = recv_ip;
        this.recv_port = recv_port;
    }

    public Date getTime() {
        return time;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public int getHost_id() {
        return host_id;
    }

    public void setHost_id(int host_id) {
        this.host_id = host_id;
    }

    public String getSend_mac_address() {
        return send_mac_address;
    }

    public void setSend_mac_address(String sendmac_address) {
        this.send_mac_address = sendmac_address;
    }

    public String getRecv_mac_address() {
        return recv_mac_address;
    }

    public void setRecv_mac_address(String recvmac_address) {
        this.recv_mac_address = recvmac_address;
    }

    public String getSend_ip() {
        return send_ip;
    }

    public void setSend_ip(String send_ip) {
        this.send_ip = send_ip;
    }

    public int getSend_port() {
        return send_port;
    }

    public void setSend_port(int send_port) {
        this.send_port = send_port;
    }

    public String getRecv_ip() {
        return recv_ip;
    }

    public void setRecv_ip(String recv_ip) {
        this.recv_ip = recv_ip;
    }

    public int getRecv_port() {
        return recv_port;
    }

    public void setRecv_port(int recv_port) {
        this.recv_port = recv_port;
    }
}
