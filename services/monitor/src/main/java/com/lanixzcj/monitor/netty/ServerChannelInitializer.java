package com.lanixzcj.monitor.netty;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;


public class ServerChannelInitializer extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel socketChannel) {
        // 解码编码
        ByteBuf buf = Unpooled.copiedBuffer("_#".getBytes());
        socketChannel.pipeline().addLast(new DelimiterBasedFrameDecoder(2048, buf));
        socketChannel.pipeline().addLast(new StringDecoder());

        socketChannel.pipeline().addLast(new ServerHandler());
    }
}
