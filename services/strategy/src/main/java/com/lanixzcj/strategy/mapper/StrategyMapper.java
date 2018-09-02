package com.lanixzcj.strategy.mapper;

import com.lanixzcj.api.entry.strategy.Threshold;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface StrategyMapper {
    @Select("select threshold.* from monitor_host as host, monitor_hostthreshold as threshold " +
            "where host.hostname=#{hostname} and host.id = threshold.hostname_id")
    Threshold getThreshold(@Param("hostname") String hostname);

    @Update("update monitor_host as host, monitor_hostthreshold as threshold set " +
            "threshold.bytes_in=#{threshold.bytes_in}, threshold.bytes_out=#{threshold.bytes_out}, " +
            "threshold.mem_used=#{threshold.mem_used}, threshold.disk_used=#{threshold.disk_used}, " +
            "threshold.cpu_used=#{threshold.cpu_used} " +
            "where host.hostname=#{hostname} and host.id = threshold.hostname_id")
    void updateThreshold(@Param("hostname") String hostname, @Param("threshold")Threshold threshold);
}
