package com.lanixzcj.monitor.redis;

import java.io.Serializable;

public class Hostinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private String macAddress;
    private String hostname;
    private String ip;
    private long lasttime;

    public Hostinfo(String macAddress, String hostname, String ip, long lasttime) {
        this.macAddress = macAddress;
        this.hostname = hostname;
        this.ip = ip;
        this.lasttime = lasttime;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
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

    public long getLasttime() {
        return lasttime;
    }

    public void setLasttime(long lasttime) {
        this.lasttime = lasttime;
    }
}
