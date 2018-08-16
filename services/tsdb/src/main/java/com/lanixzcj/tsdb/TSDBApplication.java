package com.lanixzcj.tsdb;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.util.Date;


@SpringBootApplication
public class TSDBApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(TSDBApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
