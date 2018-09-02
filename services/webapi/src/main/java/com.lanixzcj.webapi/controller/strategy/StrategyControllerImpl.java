package com.lanixzcj.webapi.controller.strategy;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.lanixzcj.api.entry.monitor.Hostinfo;
import com.lanixzcj.api.entry.strategy.Threshold;
import com.lanixzcj.api.serviceapi.IMonitorDataService;
import com.lanixzcj.api.serviceapi.IStrategyService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/monitor/strategy/")
public class StrategyControllerImpl implements StrategyController {
    @Reference(version = "1.0.0",check=true)
    private IStrategyService strategyService;

    @Override
    public boolean addThreshold(@PathVariable String hostname, @RequestBody String jsonString) {
        System.out.println(jsonString);
        JSONObject jsonObject = JSON.parseObject(jsonString);
        Threshold threshold = jsonObject.getObject("threshold", Threshold.class);
        strategyService.updateDeviceRule(hostname, threshold);
        return false;
    }

    @Override
    public HashMap<String, Object> allMonitorData(@PathVariable String host) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("device", strategyService.getDeviceRules(host));
        return map;
    }
}
