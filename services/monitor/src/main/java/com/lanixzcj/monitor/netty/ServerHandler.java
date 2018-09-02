package com.lanixzcj.monitor.netty;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.lanixzcj.api.entry.monitor.Deviceinfo;
import com.lanixzcj.api.entry.monitor.HostCacheinfo;
import com.lanixzcj.api.entry.monitor.Hostinfo;
import com.lanixzcj.api.entry.monitor.IpPacket;
import com.lanixzcj.monitor.Consumer;
import com.lanixzcj.monitor.SpringContext;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;

import java.net.InetSocketAddress;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

public class ServerHandler extends ChannelInboundHandlerAdapter {
    Consumer consumer = SpringContext.getBean(Consumer.class);
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        System.out.println("客户端与服务端连接开始...");
        NettyConfig.getInstance().getChannelGroup().add(ctx.channel());
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        System.out.println("客户端与服务端连接关闭...");
        NettyConfig.getInstance().getChannelGroup().remove(ctx.channel());
    }

    /**
     * 服务端接收客户端发送过来的数据结束之后调用
     */
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
        System.out.println("信息接收完毕...");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object info) throws Exception {
        System.out.println("信息接收..." + info.toString());
        JSONObject jsonObject = JSON.parseObject(info.toString());
        if (jsonObject == null) {
            System.out.println("Valid data.");
            return;
        }
        Consumer consumer = SpringContext.getBean(Consumer.class);
        JSONObject metric = (JSONObject) jsonObject.get("metrics");
        JSONObject host = (JSONObject) jsonObject.get("host");
        String ip = ((InetSocketAddress)ctx.channel().remoteAddress()).getAddress().getHostAddress();

        String hostname = "";
        long localtime = 0;

        if (host != null) {
            hostname = host.getString("hostname");
            localtime = host.getLong("localtime");
            String mac = host.getString("mac_address");

            HostCacheinfo hostinfo = new HostCacheinfo(mac, hostname, ip, localtime);
            consumer.redisService.set("alive_hosts:" + mac, hostinfo);

            long boottime = host.getLong("boottime");
            Timestamp timestamp = new Timestamp(boottime);
            Date last_boottime = new Date(timestamp.getTime());
            System.out.println(last_boottime.toString());

            Hostinfo hostEntry = new Hostinfo(mac, hostname, ip, last_boottime);
            consumer.monitorDataService.createOrUpdateHost(hostEntry);
        } else {
            System.out.println("Valid hostname.");
            return;
        }

        if (metric != null) {
            for (Map.Entry<String, Object> entry : metric.entrySet()) {
                JSONObject entryValue = (JSONObject)(entry.getValue());
                String metricName = entry.getKey();
//                if (entryValue.getBoolean("is_in_rrd")) {
//                    double value = entryValue.getDoubleValue("value");
//
//                    consumer.judgeService.judge(hostname, metricName, value);
//                    consumer.tsdbService.writeIntoTSDB(hostname, metricName, value, 20, localtime);
//                }
//
//                if (metricName.equals("cpu_info") || metricName.equals("mem_info")) {
//                    JSONObject hashMetric = entryValue.getJSONObject("value");
//                    for (Map.Entry<String, Object> tinyEntry : hashMetric.entrySet()) {
//                        String subKey = tinyEntry.getKey();
//                        double value = hashMetric.getDoubleValue(subKey);
//
//                        consumer.tsdbService.writeIntoTSDB(hostname, subKey, value, 20, localtime);
//                    }
//                }
                Deviceinfo deviceinfo = consumer.monitorDataService.getDeviceinfo(hostname);
                if (metricName.equals("disk_total")) {
                    double value = entryValue.getDoubleValue("value");
                    deviceinfo.setDisk_total(value);
                }
                if (metricName.equals("disk_free")) {
                    double value = entryValue.getDoubleValue("value");
                    deviceinfo.setDisk_free(value);
                }
                if (metricName.equals("mem_total")) {
                    double value = entryValue.getDoubleValue("value");
                    deviceinfo.setMem_total(value);
                }
                consumer.monitorDataService.updateDeviceinfo(hostname, deviceinfo);

                if (metricName.equals("net_pack")) {
                    JSONObject hashMetric = entryValue.getJSONObject("value");
                    String time = hashMetric.getString("time");
                    String source_MAC = hashMetric.getString("source_MAC");
                    String des_MAC = hashMetric.getString("des_MAC");
                    String source_IP = hashMetric.getString("source_IP");
                    if (source_IP == null) continue;
                    String des_IP = hashMetric.getString("des_IP");
                    String source_port = hashMetric.getString("source_port");
                    String des_port = hashMetric.getString("des_port");

                    consumer.monitorDataService.addIpPackets(hostname,
                            new IpPacket(new Date(new Timestamp(Long.valueOf(time)).getTime()),
                                    source_MAC, des_MAC, source_IP, Integer.valueOf(source_port),
                                    des_IP, Integer.valueOf(des_port)));
                }

            }
        }

    }
}

