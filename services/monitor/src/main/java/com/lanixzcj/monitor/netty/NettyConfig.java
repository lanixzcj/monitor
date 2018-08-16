package com.lanixzcj.monitor.netty;

import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;

public class NettyConfig {
    private static NettyConfig sInstance;
    private static ChannelGroup group;

    public static NettyConfig getInstance() {
        if (sInstance == null) {
            synchronized (NettyConfig.class) {
                if (sInstance == null) {
                    sInstance = new NettyConfig();
                    group = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
                }
            }
        }

        return sInstance;
    }

    public ChannelGroup getChannelGroup() {
        return group;
    }
}
