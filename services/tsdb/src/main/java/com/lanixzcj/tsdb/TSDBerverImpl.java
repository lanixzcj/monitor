package com.lanixzcj.tsdb;

import com.alibaba.dubbo.config.annotation.Service;
import com.lanixzcj.api.serviceapi.ITSDBService;

import java.io.File;


@Service(version = "1.0.0")
public class TSDBerverImpl implements ITSDBService {
    @Override
    public void writeIntoTSDB(String hostname, String metric, double value, int step, long processTime) {
        String hostDir = Constants.RRD_PATH + "/" + hostname + "/";
        File dir = new File(hostDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String rrdName = metric + ".rrd";
        File file = new File(hostDir + rrdName);

        if (!file.exists()) {
            RRDHelper.createRRD(hostDir, rrdName, step, processTime);
        } else {
            RRDHelper.updateRRD(hostDir, rrdName, value, processTime);
        }

    }

}
