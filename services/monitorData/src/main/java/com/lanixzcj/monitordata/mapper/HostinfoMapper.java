package com.lanixzcj.monitordata.mapper;

import com.lanixzcj.api.entry.monitor.Hostinfo;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

@Mapper
public interface HostinfoMapper {

    @Select("select * from monitor_host")
    public List<Hostinfo> getHosts();
    @Select("select * from monitor_host where mac_address=#{mac_address} limit 0,1")
    Hostinfo getHost(@Param("mac_address") String mac_address);

    @Select("select * from monitor_host where hostname=#{hostname} limit 0,1")
    Hostinfo getHostByName(@Param("hostname") String hostname);

    @Insert("INSERT INTO monitor_host(hostname, ip, mac_address, last_boottime) " +
            "VALUES(#{hostname}, #{ip}, #{mac_address}, #{last_boottime})")
    void createHost(@Param("hostname") String hostname, @Param("ip") String ip,
                    @Param("mac_address") String mac_address, @Param("last_boottime") Date last_boottime);

    @Insert("INSERT INTO monitor_host(hostname, ip, mac_address, last_boottime) " +
            "VALUES(#{hostname}, #{ip}, #{mac_address}, #{last_boottime})")
    void createHostWithEntry(Hostinfo host);

    @Update("UPDATE monitor_host set hostname=#{hostname}, ip=#{ip}, last_boottime=#{last_boottime}" +
            "where mac_address=#{mac_address}")
    void updateHost(Hostinfo host);
}
