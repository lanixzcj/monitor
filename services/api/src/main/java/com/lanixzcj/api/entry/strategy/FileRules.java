package com.lanixzcj.api.entry.strategy;

import java.io.Serializable;

public class FileRules implements Serializable {
    private static final long serialVersionUID = -1L;

    private int hostid;
    private String file;
    private String permission;

    public FileRules(int hostid, String file, String permission) {
        this.hostid = hostid;
        this.file = file;
        this.permission = permission;
    }

    public int getHostid() {
        return hostid;
    }

    public void setHostid(int hostid) {
        this.hostid = hostid;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
