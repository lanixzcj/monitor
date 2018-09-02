package com.lanixzcj.api.serviceapi;

import com.lanixzcj.api.entry.monitor.*;
import com.lanixzcj.api.entry.strategy.FileRules;
import com.lanixzcj.api.entry.strategy.IpPacketsRules;
import com.lanixzcj.api.entry.strategy.Threshold;

import java.util.List;

public interface IStrategyService {
    boolean updateDeviceRule(String hostname, Threshold threshold);
    boolean addIpRule(String hostname, IpPacketsRules ipPacketsRules);
    boolean addFileRule(String hostname, FileRules fileRules);
    boolean removeIpRule(String hostname, List<Integer> ids);
    boolean removeFileRule(String hostname, List<Integer> ids);
    Deviceinfo getDeviceinfo(String hostname);
    List<FileRules> getFilerules(String hostname);
    List<IpPacketsRules> getIpRules (String hostname);
    Threshold getDeviceRules (String hostname);
}
