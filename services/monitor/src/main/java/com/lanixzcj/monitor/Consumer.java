package com.lanixzcj.monitor;

import com.alibaba.dubbo.config.annotation.Reference;
import com.lanixzcj.api.serviceapi.IJudgeService;
import com.lanixzcj.api.serviceapi.IMonitorDataService;
import com.lanixzcj.api.serviceapi.IRedisService;
import com.lanixzcj.api.serviceapi.ITSDBService;
import org.springframework.stereotype.Component;

@Component
public class Consumer {
    @Reference(version = "1.0.0",check=true)
    public IJudgeService judgeService;
    @Reference(version = "1.0.0",check=true)
    public ITSDBService tsdbService;
    @Reference(version = "1.0.0",check=true)
    public IMonitorDataService monitorDataService;
    @Reference(version = "1.0.0",check=true)
    public IRedisService redisService;
}
