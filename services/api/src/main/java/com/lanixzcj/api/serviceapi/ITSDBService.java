package com.lanixzcj.api.serviceapi;

public interface ITSDBService {
    void writeIntoTSDB(String hostname, String metric, double value, int step, long processTime);
}
