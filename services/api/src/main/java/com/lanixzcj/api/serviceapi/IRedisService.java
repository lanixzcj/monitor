package com.lanixzcj.api.serviceapi;

public interface IRedisService {
    Object get(String key);
    boolean set(String key, Object value);
}
