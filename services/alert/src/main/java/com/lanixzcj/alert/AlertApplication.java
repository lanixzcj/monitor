package com.lanixzcj.alert;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;


@SpringBootApplication
@MapperScan("com.lanixzcj.alert.mapper")
public class AlertApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(AlertApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
