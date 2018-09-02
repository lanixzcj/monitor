package com.lanixzcj.api.serviceapi;

import com.lanixzcj.api.entry.monitor.*;

import java.util.List;

public interface IMonitorDataService {
    boolean createOrUpdateHost(Hostinfo hostinfo);
    boolean updateDeviceinfo(String hostname, Deviceinfo deviceinfo);
    boolean addFileinfos(String hostname, Fileinfo fileinfo);
    boolean addIpPackets(String hostname, IpPacket ipPacket);
    boolean addProcessinfo(String hostname, Processinfo processinfo);
    Deviceinfo getDeviceinfo(String hostname);
    List<Fileinfo> getFileinfos(String hostname);
    List<Object> getIpPackets (String hostname);
    List<Processinfo> getProcessinfos (String hostname);
    List<Hostinfo> getHosts();
}
