package com.lanixzcj.monitordata;

import com.alibaba.dubbo.config.annotation.Service;
import com.lanixzcj.api.entry.monitor.*;
import com.lanixzcj.api.serviceapi.IMonitorDataService;
import com.lanixzcj.monitordata.mapper.HostinfoMapper;
import com.lanixzcj.monitordata.mapper.MonitorDataMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;


@Service(version = "1.0.0")
public class MonitorDataServerImpl implements IMonitorDataService {
    @Autowired
    HostinfoMapper hostinfoMapper;
    @Autowired
    MonitorDataMapper monitorDataMapper;

    @Override
    public boolean createOrUpdateHost(Hostinfo hostinfo) {
        if (hostinfoMapper.getHost(hostinfo.getMac_address()) == null) {
            hostinfoMapper.createHostWithEntry(hostinfo);
            hostinfo = hostinfoMapper.getHost(hostinfo.getMac_address());
            if (hostinfo != null) {
                monitorDataMapper.createDeviceInfo(hostinfo.getId());
                monitorDataMapper.createThreshold(hostinfo.getId());
            } else {
                return false;
            }
        } else {
            hostinfoMapper.updateHost(hostinfo);
        }
        return true;
    }

    @Override
    public boolean updateDeviceinfo(String hostname, Deviceinfo deviceinfo) {
        monitorDataMapper.updateDeviceinfo(hostname, deviceinfo);
        return false;
    }

    @Override
    public boolean addFileinfos(String hostname, Fileinfo fileinfo) {
        return false;
    }

    @Override
    public boolean addIpPackets(String hostname, IpPacket ipPacket) {
        Hostinfo hostinfo = hostinfoMapper.getHostByName(hostname);

        if (hostinfo == null) return false;

        ipPacket.setHost_id(hostinfo.getId());
        monitorDataMapper.insertIpPacket(ipPacket);
        return true;
    }

    @Override
    public boolean addProcessinfo(String hostname, Processinfo processinfo) {
        return false;
    }

    @Override
    public Deviceinfo getDeviceinfo(String hostname) {
        return monitorDataMapper.getDeviceinfo(hostname);
    }

    @Override
    public List<Fileinfo> getFileinfos(String hostname) {
        return monitorDataMapper.getFileinfos(hostname);
    }

    @Override
    public List<Object> getIpPackets(String hostname) {
        List<IpPacket> ipPackets = monitorDataMapper.getIpPackets(hostname);
        List<Object> list = new ArrayList<>();
        list.add(ipPackets);
        list.add(ipPackets.size());
        return list;
    }

    @Override
    public List<Processinfo> getProcessinfos(String hostname) {
        return monitorDataMapper.getProcessinfos(hostname);
    }

    @Override
    public List<Hostinfo> getHosts() {
        return hostinfoMapper.getHosts();
    }
}
