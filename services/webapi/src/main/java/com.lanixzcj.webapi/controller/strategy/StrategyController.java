package com.lanixzcj.webapi.controller.strategy;


import com.lanixzcj.api.entry.monitor.Hostinfo;
import com.lanixzcj.api.entry.strategy.Threshold;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

public interface StrategyController {
    @PostMapping("device/{hostname}")
    boolean addThreshold(@PathVariable("hostname") String hostname, @RequestBody String jsonString);

    @GetMapping("/all/{host}")
    public HashMap<String, Object> allMonitorData(@PathVariable("host") String host);
}
