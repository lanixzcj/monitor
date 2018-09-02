package com.lanixzcj.strategy;

import com.alibaba.dubbo.config.annotation.Service;
import com.lanixzcj.api.entry.monitor.*;
import com.lanixzcj.api.entry.strategy.FileRules;
import com.lanixzcj.api.entry.strategy.IpPacketsRules;
import com.lanixzcj.api.entry.strategy.Threshold;
import com.lanixzcj.api.serviceapi.IMonitorDataService;
import com.lanixzcj.api.serviceapi.IStrategyService;
import com.lanixzcj.strategy.mapper.StrategyMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;


@Service(version = "1.0.0")
public class StrategyServerImpl implements IStrategyService {
    @Autowired
    StrategyMapper strategyMapper;

    @Override
    public boolean updateDeviceRule(String hostname, Threshold threshold) {
        System.out.println(hostname);
        System.out.println(threshold.getCpu_used());
        strategyMapper.updateThreshold(hostname, threshold);
        return false;
    }

    @Override
    public boolean addIpRule(String hostname, IpPacketsRules ipPacketsRules) {
        return false;
    }

    @Override
    public boolean addFileRule(String hostname, FileRules fileRules) {
        return false;
    }

    @Override
    public boolean removeIpRule(String hostname, List<Integer> ids) {
        return false;
    }

    @Override
    public boolean removeFileRule(String hostname, List<Integer> ids) {
        return false;
    }

    @Override
    public Deviceinfo getDeviceinfo(String hostname) {
        return null;
    }

    @Override
    public List<FileRules> getFilerules(String hostname) {
        return null;
    }

    @Override
    public List<IpPacketsRules> getIpRules(String hostname) {
        return null;
    }

    @Override
    public Threshold getDeviceRules(String hostname) {
        return strategyMapper.getThreshold(hostname);
    }
}
