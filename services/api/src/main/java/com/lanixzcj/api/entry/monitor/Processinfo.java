package com.lanixzcj.api.entry.monitor;

import javax.xml.crypto.Data;
import java.io.Serializable;

public class Processinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private int hostid;
    private Data time;
    private String command;
    private String state;
    private double mem_used;
    private double cpu_used;
    private int process_id;
    private String boottime;
    private String runtime;

    public Processinfo(int hostid, Data time, String command, String state, double mem_used, double cpu_used, int process_id, String boottime, String runtime) {
        this.hostid = hostid;
        this.time = time;
        this.command = command;
        this.state = state;
        this.mem_used = mem_used;
        this.cpu_used = cpu_used;
        this.process_id = process_id;
        this.boottime = boottime;
        this.runtime = runtime;
    }

    public int getHostid() {
        return hostid;
    }

    public void setHostid(int hostid) {
        this.hostid = hostid;
    }

    public Data getTime() {
        return time;
    }

    public void setTime(Data time) {
        this.time = time;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
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

    public int getProcess_id() {
        return process_id;
    }

    public void setProcess_id(int process_id) {
        this.process_id = process_id;
    }

    public String getBoottime() {
        return boottime;
    }

    public void setBoottime(String boottime) {
        this.boottime = boottime;
    }

    public String getRuntime() {
        return runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }
}
