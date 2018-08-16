package com.lanixzcj.monitor;//import com.lanixzcj.monitor.netty.NettyServer;
//import io.netty.channel.ChannelFuture;
import com.lanixzcj.monitor.netty.NettyServer;
import io.netty.channel.ChannelFuture;
import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ConfigurableApplicationContext;

import java.net.InetSocketAddress;


@SpringBootApplication
@EnableCaching
@MapperScan("com.lanixzcj.monitor.mapper")
public class MonitorApplication implements CommandLineRunner {

    @Value("${server.port}")
    private int port;


    @Autowired
    private NettyServer socketServer;
    public static void main(String[] args) {
        ConfigurableApplicationContext run = new SpringApplicationBuilder(MonitorApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }

    @Override
    public void run(String... strings) {
        InetSocketAddress address = new InetSocketAddress(port);
        ChannelFuture future = socketServer.run(address);
        Runtime.getRuntime().addShutdownHook(new Thread(){
            @Override
            public void run() {
                socketServer.destroy();
            }
        });
        future.channel().closeFuture().syncUninterruptibly();
    }

}
