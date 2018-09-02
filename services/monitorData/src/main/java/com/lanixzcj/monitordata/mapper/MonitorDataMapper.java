package com.lanixzcj.monitordata.mapper;

import com.lanixzcj.api.entry.monitor.Deviceinfo;
import com.lanixzcj.api.entry.monitor.Fileinfo;
import com.lanixzcj.api.entry.monitor.IpPacket;
import com.lanixzcj.api.entry.monitor.Processinfo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MonitorDataMapper {
    @Insert("INSERT INTO monitor_deviceinfo VALUES(#{hostname_id}, 100, 0, 1800000)")
    void createDeviceInfo(@Param("hostname_id") Integer hostname_id);

    @Insert("INSERT INTO monitor_hostthreshold VALUES(#{hostname_id}, 0 ,0 ,0 ,0 ,0)")
    void createThreshold(@Param("hostname_id") Integer hostname_id);

    @Select("select device.* from monitor_deviceinfo as device join monitor_host as host " +
            "where host.hostname=#{hostname} and host.id = device.hostname_id")
    Deviceinfo getDeviceinfo(@Param("hostname") String hostname);

    @Update("update monitor_host as host, monitor_deviceinfo as device set " +
            "device.disk_total=#{device.disk_total}, device.disk_free=#{device.disk_free}, " +
            "device.mem_total=#{device.mem_total} " +
            "where host.hostname=#{hostname} and host.id = device.hostname_id")
    boolean updateDeviceinfo(@Param("hostname") String hostname, @Param("device") Deviceinfo device);

    @Select("select file.* from monitor_fileinfo as file join monitor_host as host " +
            "where host.hostname=#{hostname} and host.id = file.host_id")
    List<Fileinfo> getFileinfos(@Param("hostname") String hostname);

    @Insert("INSERT INTO monitor_ippacket(time, send_mac_address, recv_mac_address, " +
            "send_ip, send_port, recv_ip, recv_port, host_id) " +
            "VALUES (#{time}, #{send_mac_address}, #{recv_mac_address}, " +
            "#{send_ip}, #{send_port}, #{recv_ip}, #{recv_port}, #{host_id})")
    void insertIpPacket(IpPacket ipPacket);

    @Select("select ip.* from monitor_ippacket as ip join monitor_host as host " +
            "where host.hostname=#{hostname} and host.id = ip.host_id ")
    List<IpPacket> getIpPackets(@Param("hostname") String hostname);

    @Select("select count(1) from monitor_ippacket ip join monitor_host as host " +
            "where host.hostname=#{hostname} and host.id = ip.host_id ")
    int getIpPacketsCount(@Param("hostname") String hostname);

    @Select("select p.* from monitor_processinfo as p join monitor_host as host " +
            "where host.hostname=#{hostname} and host.id = p.host_id")
    List<Processinfo> getProcessinfos(@Param("hostname") String hostname);
}
