package com.lanixzcj.api.entry.monitor;

import java.io.Serializable;
import java.util.Date;

public class Hostinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private int id;
    private String mac_address;
    private String hostname;
    private String ip;
    private Date last_boottime;
    private int stat;

    public Date getLast_boottime() {
        return last_boottime;
    }

    public void setLast_boottime(Date last_boottime) {
        this.last_boottime = last_boottime;
    }

    public String getMac_address() {
        return mac_address;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setMac_address(String mac_address) {
        this.mac_address = mac_address;
    }

    public int getStat() {
        return stat;
    }

    public void setStat(int stat) {
        this.stat = stat;
    }

    public Hostinfo() {
    }

    public Hostinfo(String mac_address, String hostname, String ip, Date last_boottime) {
        this.mac_address = mac_address;
        this.hostname = hostname;
        this.ip = ip;
        this.last_boottime = last_boottime;
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


}
