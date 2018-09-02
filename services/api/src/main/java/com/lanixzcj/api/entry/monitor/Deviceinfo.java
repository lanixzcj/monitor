package com.lanixzcj.api.entry.monitor;

import java.io.Serializable;

public class Deviceinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private int hostname_id;
    private double disk_total;
    private double disk_free;
    private double mem_total;

    public Deviceinfo(int hostname_id, double disk_total, double disk_free, double mem_total) {
        this.hostname_id = hostname_id;
        this.disk_total = disk_total;
        this.disk_free = disk_free;
        this.mem_total = mem_total;
    }

    public int getHostname_id() {
        return hostname_id;
    }

    public void setHostname_id(int hostname_id) {
        this.hostname_id = hostname_id;
    }

    public double getDisk_total() {
        return disk_total;
    }

    public void setDisk_total(double disk_total) {
        this.disk_total = disk_total;
    }

    public double getDisk_free() {
        return disk_free;
    }

    public void setDisk_free(double disk_free) {
        this.disk_free = disk_free;
    }

    public double getMem_total() {
        return mem_total;
    }

    public void setMem_total(double mem_total) {
        this.mem_total = mem_total;
    }
}
