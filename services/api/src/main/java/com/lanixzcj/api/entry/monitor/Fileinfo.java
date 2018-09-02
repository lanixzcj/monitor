package com.lanixzcj.api.entry.monitor;

import java.io.Serializable;
import java.util.Date;

public class Fileinfo implements Serializable {
    private static final long serialVersionUID = -1L;

    private Date time;
    private int host_id;
    private String file_name;
    private String operate_type;

    public Fileinfo(Date time, int host_id, String file_name, String operate_type) {
        this.time = time;
        this.host_id = host_id;
        this.file_name = file_name;
        this.operate_type = operate_type;
    }

    public Date getTime() {
        return time;
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

    public String getFile_name() {
        return file_name;
    }

    public void setFile_name(String file_name) {
        this.file_name = file_name;
    }

    public String getOperate_type() {
        return operate_type;
    }

    public void setOperate_type(String operate_type) {
        this.operate_type = operate_type;
    }
}
