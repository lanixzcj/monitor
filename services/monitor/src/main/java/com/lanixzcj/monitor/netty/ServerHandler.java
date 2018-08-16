package com.lanixzcj.monitor.netty;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.lanixzcj.monitor.Consumer;
import com.lanixzcj.monitor.SpringContext;
import com.lanixzcj.monitor.mapper.HostMapper;
import com.lanixzcj.monitor.model.Host;
import com.lanixzcj.monitor.redis.Hostinfo;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import org.springframework.data.redis.core.RedisTemplate;

import java.net.InetSocketAddress;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class ServerHandler extends ChannelInboundHandlerAdapter {
    RedisTemplate redisTemplate = (RedisTemplate) SpringContext.getBean("redisTemplate");
    HostMapper hostMapper = SpringContext.getBean(HostMapper.class);
    boolean first = true;
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

            Hostinfo hostinfo = new Hostinfo(mac, hostname, ip, localtime);
            redisTemplate.opsForValue().set("alive_hosts:" + mac, hostinfo);

            if (first) {
                long boottime = host.getLong("boottime");
                Timestamp timestamp = new Timestamp(boottime);
                Date last_boottime = new Date(timestamp.getTime());
                System.out.println(last_boottime.toString());

                Host hostEntry = new Host(hostname, ip, mac, last_boottime);
                if (hostMapper.getHost(mac) == null) {
                    hostMapper.createHostWithEntry(hostEntry);
                    hostEntry = hostMapper.getHost(mac);
                    if (hostEntry != null) {
                        hostMapper.createDeviceInfo(hostEntry.getId());
                        hostMapper.createThreshold(hostEntry.getId());
                    }
                } else {
                    hostMapper.updateHost(hostEntry);
                }

                first = false;
            }
        } else {
            System.out.println("Valid hostname.");
            return;
        }

        if (metric != null) {
            for (Map.Entry<String, Object> entry : metric.entrySet()) {
                JSONObject entryValue = (JSONObject)(entry.getValue());
                String metricName = entry.getKey();
                if (entryValue.getBoolean("is_in_rrd")) {
                    double value = entryValue.getDoubleValue("value");

                    consumer.judgeService.judge(hostname, metricName, value);
                    consumer.tsdbService.writeIntoTSDB(hostname, metricName, value, 20, localtime);
                }

                if (metricName.equals("cpu_info") || metricName.equals("mem_info")) {
                    JSONObject hashMetric = entryValue.getJSONObject("value");
                    for (Map.Entry<String, Object> tinyEntry : hashMetric.entrySet()) {
                        String subKey = tinyEntry.getKey();
                        double value = hashMetric.getDoubleValue(subKey);

                        consumer.tsdbService.writeIntoTSDB(hostname, subKey, value, 20, localtime);
                    }
                }

            }
        }

    }
}

