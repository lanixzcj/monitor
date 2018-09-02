package com.lanixzcj.webapi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class WebapiApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(WebapiApplication.class)
                .run(args);
    }
}
