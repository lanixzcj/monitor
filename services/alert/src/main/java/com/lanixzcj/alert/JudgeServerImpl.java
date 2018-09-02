package com.lanixzcj.alert;

import com.alibaba.dubbo.config.annotation.Service;
import com.lanixzcj.alert.mapper.ThresholdMapper;
import com.lanixzcj.alert.model.Alert;
import com.lanixzcj.api.entry.strategy.Threshold;
import com.lanixzcj.api.serviceapi.IJudgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;


@Service(version = "1.0.0")
public class JudgeServerImpl implements IJudgeService {
    @Autowired
    ThresholdMapper thresholdMapper;
    @Autowired
    RedisTemplate redisTemplate;

    public void judge(String host, String metricName, Double value) {
        System.out.println(host);
        System.out.println(metricName);
        System.out.println(value);
        Threshold threshold = thresholdMapper.getThreshold(host);
        double thresholdValue = 0;
        switch (metricName) {
            case "bytes_in":
                thresholdValue = threshold.getBytes_in();
                break;
            case "bytes_out":
                thresholdValue = threshold.getBytes_out();
                break;
            case "disk_used":
                thresholdValue = threshold.getDisk_used();
                break;
            case "men_used":
                thresholdValue = threshold.getMen_used();
                break;
            case "cpu_used":
                default:
                    thresholdValue = 0;
        }

//        if (thresholdValue == 0) {
//            return;
//        }

        if (value > thresholdValue) {
            Alert alertEntry = new Alert(metricName, thresholdValue, value);
            redisTemplate.opsForList().rightPush("alert:" + host, alertEntry);
        }

    }
}
