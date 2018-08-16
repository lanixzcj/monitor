package com.lanixzcj.monitor.model;

import java.util.Date;

public class Host {
    private Integer id;

    private String hostname;

    private String ip;

    private String mac_address;

    private Date last_boottime;

    public Host(String hostname, String ip, String mac_address, Date last_boottime) {
        this.hostname = hostname;
        this.ip = ip;
        this.mac_address = mac_address;
        this.last_boottime = last_boottime;
    }

    public Host() {
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getMac_address() {
        return mac_address;
    }

    public void setMac_address(String mac_address) {
        this.mac_address = mac_address;
    }

    public Date getLast_boottime() {
        return last_boottime;
    }

    public void setLast_boottime(Date last_boottime) {
        this.last_boottime = last_boottime;
    }
}
