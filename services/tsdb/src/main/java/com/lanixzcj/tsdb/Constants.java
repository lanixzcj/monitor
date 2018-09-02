package com.lanixzcj.tsdb;

//import javafx.util.Pair;
import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class Constants{

    public static String RRD_PATH;
    public static Map<String, Pair<Integer, String>> timeRangeMap;
    public static Map<String, Pair<Integer, Integer>> graphSizeMap;

    static{
        timeRangeMap = new HashMap<>();
        timeRangeMap.put("hour", new Pair<>(3600, "小时"));
        timeRangeMap.put("2h", new Pair<>(7200, "小时"));
        timeRangeMap.put("4h", new Pair<>(14400, "小时"));
        timeRangeMap.put("day", new Pair<>(86400, "小时"));
        timeRangeMap.put("week", new Pair<>(604800, "小时"));
        timeRangeMap.put("month", new Pair<>(2419200, "小时"));
        timeRangeMap.put("year", new Pair<>(31449600, "小时"));

        graphSizeMap = new HashMap<>();
        graphSizeMap.put("small", new Pair<>(200, 65));
        graphSizeMap.put("medium", new Pair<>(300, 95));
        graphSizeMap.put("large", new Pair<>(480, 150));
        graphSizeMap.put("xlarge", new Pair<>(650, 300));
        graphSizeMap.put("default", new Pair<>(400, 125));
    }

    @Value("${rrd.path}")
    public void setRrdPath(String rrdPath) {
        this.RRD_PATH = rrdPath;
    }
}