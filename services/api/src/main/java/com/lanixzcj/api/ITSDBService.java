package com.lanixzcj.api;

public interface ITSDBService {
    void writeIntoTSDB(String hostname, String metric, double value, int step, long processTime);
}
