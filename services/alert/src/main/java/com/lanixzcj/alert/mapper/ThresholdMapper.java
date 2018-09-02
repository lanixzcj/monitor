package com.lanixzcj.alert.mapper;

import com.lanixzcj.api.entry.strategy.Threshold;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ThresholdMapper {
    @Select("select threshold.* from monitor_host as host, monitor_hostthreshold as threshold " +
            "where host.hostname=#{hostname} and host.id = threshold.hostname_id")
    Threshold getThreshold(@Param("hostname") String hostname);
}
