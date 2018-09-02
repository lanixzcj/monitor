package com.lanixzcj.monitordata;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;


@SpringBootApplication
@MapperScan("com.lanixzcj.monitordata.mapper")
public class MonitorDataApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(MonitorDataApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
