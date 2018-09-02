package com.lanixzcj.api.entry.strategy;

import java.io.Serializable;

public class Threshold implements Serializable {
    private static final long serialVersionUID = -1L;

    Integer hostname_id;
    double bytes_in;
    double bytes_out;
    double disk_used;
    double mem_used;
    double cpu_used;


    public Integer getHostname_id() {
        return hostname_id;
    }

    public void setHostname_id(Integer hostname_id) {
        this.hostname_id = hostname_id;
    }

    public double getBytes_in() {
        return bytes_in;
    }

    public void setBytes_in(double bytes_in) {
        this.bytes_in = bytes_in;
    }

    public double getBytes_out() {
        return bytes_out;
    }

    public void setBytes_out(double bytes_out) {
        this.bytes_out = bytes_out;
    }

    public double getDisk_used() {
        return disk_used;
    }

    public void setDisk_used(double disk_used) {
        this.disk_used = disk_used;
    }

    public double getMem_used() {
        return mem_used;
    }

    public void setMem_used(double mem_used) {
        this.mem_used = mem_used;
    }

    public double getCpu_used() {
        return cpu_used;
    }

    public void setCpu_used(double cpu_used) {
        this.cpu_used = cpu_used;
    }
}
