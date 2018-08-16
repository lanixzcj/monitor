package com.lanixzcj.tsdb;

import javafx.util.Pair;
import net.stamfest.rrd.CommandResult;
import net.stamfest.rrd.RRDException;
import org.rrd4j.ConsolFun;
import org.rrd4j.core.*;
import org.rrd4j.graph.RrdGraph;
import org.rrd4j.graph.RrdGraphDef;
import org.rrd4j.graph.RrdGraphInfo;


import java.io.File;
import java.io.IOException;
import java.util.Date;

import static org.rrd4j.DsType.*;
import static org.rrd4j.ConsolFun.*;
import net.stamfest.rrd.RRDp;

public class RRDHelper {
    public static void createRRD(String dir, String rrdName, int step, long processTime) {
        try {
            RRDp rrd = new RRDp(dir, "");
            String[] command = {"create", rrdName, "--step", "" + step, "--start", "" + processTime,
                    "DS:sum:GAUGE:" + step * 2 + ":U:U",
                    "RRA:AVERAGE:0.5:1:5856", "RRA:AVERAGE:0.5:4:20160", "RRA:AVERAGE:0.5:40:52704"};
            CommandResult result = rrd.command(command);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (RRDException e) {
            e.printStackTrace();
        }

    }

    public static void updateRRD(String dir, String rrdName, double value, long processTime) {
        try {
            RRDp rrd = new RRDp(dir, "");
            String[] command = {"update", rrdName, processTime + ":" + value};
            CommandResult result = rrd.command(command);
            System.out.println(result.getError());;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (RRDException e) {
            e.printStackTrace();
        }
    }

    public static void startCache() {

    }

    public static byte[] graph(String hostname, String metricName, String timerange, String size) {
//        Pair<Integer, String> timerangePair = Constants.timeRangeMap.get(timerange);
//        Pair<Integer, Integer> sizePair = Constants.graphSizeMap.get(size);
//        try {
//            RrdGraphDef graphDef = new RrdGraphDef();
//            graphDef.setStartTime(-timerangePair.getKey());
//            graphDef.setEndTime(new Date().getTime());
//            graphDef.setWidth(sizePair.getKey());
//            graphDef.setHeight(sizePair.getKey());
//            RrdGraph graph = new RrdGraph(graphDef);
//            byte[] graphBytes = graph.getRrdGraphInfo().getBytes();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return null;
    }



    public static void fetchData(String rrdName, String timerange) {
//        Pair<Integer, String> timerangePair = Constants.timeRangeMap.get(timerange);
//        RrdDb rrdDb = null;
//        try {
//            rrdDb = new RrdDb(rrdName);
//            FetchRequest request = rrdDb.createFetchRequest(AVERAGE, -timerangePair.getKey(), 0);
//            FetchData fetchData = request.fetchData();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

    }
}
