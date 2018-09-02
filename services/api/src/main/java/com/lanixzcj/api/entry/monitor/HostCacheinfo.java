package com.lanixzcj.api.entry.monitor;

import java.io.Serializable;

public class HostCacheinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private String mac_address;
    private String hostname;
    private String ip;
    private long lasttime;

    public HostCacheinfo(String mac_address, String hostname, String ip, long lasttime) {
        this.mac_address = mac_address;
        this.hostname = hostname;
        this.ip = ip;
        this.lasttime = lasttime;
    }

    public String getmac_address() {
        return mac_address;
    }

    public void setmac_address(String mac_address) {
        this.mac_address = mac_address;
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
