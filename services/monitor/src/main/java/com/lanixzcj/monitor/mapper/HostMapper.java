package com.lanixzcj.monitor.mapper;

import com.lanixzcj.monitor.model.Host;
import org.apache.ibatis.annotations.*;

import java.util.Date;

@Mapper
public interface HostMapper {
    @Select("select * from monitor_host where mac_address=#{mac_address} limit 0,1")
    Host getHost(@Param("mac_address") String mac_address);

    @Insert("INSERT INTO monitor_host(hostname, ip, mac_address, last_boottime) " +
            "VALUES(#{hostname}, #{ip}, #{mac_address}, #{last_boottime})")
    void createHost(@Param("hostname") String hostname, @Param("ip") String ip,
                    @Param("mac_address") String mac_address, @Param("last_boottime") Date last_boottime);

    @Insert("INSERT INTO monitor_host(hostname, ip, mac_address, last_boottime) " +
            "VALUES(#{hostname}, #{ip}, #{mac_address}, #{last_boottime})")
    void createHostWithEntry(Host host);

    @Update("UPDATE monitor_host set hostname=#{hostname}, ip=#{ip}, last_boottime=#{last_boottime}" +
                    "where mac_address=#{mac_address}")
    void updateHost(Host host);

    @Insert("INSERT INTO monitor_deviceinfo VALUES(#{hostname_id}, 100, 0, 1800000)")
    void createDeviceInfo(@Param("hostname_id") Integer hostname_id);

    @Insert("INSERT INTO monitor_hostthreshold VALUES(#{hostname_id}, 0 ,0 ,0 ,0 ,0)")
    void createThreshold(@Param("hostname_id") Integer hostname_id);
}
