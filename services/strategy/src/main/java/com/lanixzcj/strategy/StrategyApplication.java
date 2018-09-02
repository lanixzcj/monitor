package com.lanixzcj.strategy;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;


@SpringBootApplication
public class StrategyApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(StrategyApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
