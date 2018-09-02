package com.lanixzcj.redis;

import com.alibaba.dubbo.config.annotation.Service;
import com.lanixzcj.api.serviceapi.IRedisService;
import org.springframework.data.redis.core.RedisTemplate;

import javax.annotation.Resource;

@Service(version = "1.0.0")
public class RedisServiceImpl implements IRedisService {
    @Resource(name = "redisTemplate")
    RedisTemplate redisTemplate;

    @Override
    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public boolean set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
        return false;
    }
}
