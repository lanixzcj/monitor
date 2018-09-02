package com.lanixzcj.webapi.controller.monitordata;

import com.alibaba.dubbo.config.annotation.Reference;
import com.lanixzcj.api.entry.monitor.Hostinfo;
import com.lanixzcj.api.serviceapi.IMonitorDataService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/monitor")
public class MonitorDataControllerImpl implements MonitorDataController {
    @Reference(version = "1.0.0",check=true)
    private IMonitorDataService monitorDataService;

    @Override
    public HashMap<String, Object> allMonitorData(@PathVariable("host") String host, String r) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("deviceinfo", monitorDataService.getDeviceinfo(host));
        map.put("ip_packet", monitorDataService.getIpPackets(host));
        return map;
    }

    @Override
    public List<Hostinfo> hosts() {
        return monitorDataService.getHosts();
    }
}
