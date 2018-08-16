package com.lanixzcj.monitor;

import com.alibaba.dubbo.config.annotation.Reference;
import com.lanixzcj.api.IJudgeService;
import com.lanixzcj.api.ITSDBService;
import org.springframework.stereotype.Component;

@Component
public class Consumer {
    @Reference(version = "1.0.0",check=true)
    public IJudgeService judgeService;
    @Reference(version = "1.0.0",check=true)
    public ITSDBService tsdbService;
}
