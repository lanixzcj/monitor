package com.lanixzcj.api.entry.strategy;

import java.io.Serializable;

public class IpPacketsRules implements Serializable {
    private static final long serialVersionUID = -1L;

    private int host_id;
    private String rule_chain;
    private String ip;

    public IpPacketsRules(int hostid, String rule_chain, String ip) {
        this.host_id = hostid;
        this.rule_chain = rule_chain;
        this.ip = ip;
    }

    public int getHostid() {
        return host_id;
    }

    public void setHostid(int hostid) {
        this.host_id = hostid;
    }

    public String getRule_chain() {
        return rule_chain;
    }

    public void setRule_chain(String rule_chain) {
        this.rule_chain = rule_chain;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }
}
