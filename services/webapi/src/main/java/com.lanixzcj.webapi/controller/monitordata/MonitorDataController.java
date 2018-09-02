package com.lanixzcj.webapi.controller.monitordata;


import com.lanixzcj.api.entry.monitor.Hostinfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;

public interface MonitorDataController {
    @GetMapping("monitor/all/{host}")
    public HashMap<String, Object> allMonitorData(@PathVariable("host") String host, @RequestParam(value="r",required = true) String r);

    @GetMapping("hosts")
    public List<Hostinfo> hosts();
}
