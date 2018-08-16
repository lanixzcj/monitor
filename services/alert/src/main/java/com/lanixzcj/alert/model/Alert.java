package com.lanixzcj.alert.model;

import java.io.Serializable;

public class Alert  implements Serializable {
    private static final long serialVersionUID = -1L;
    String metricName;
    double threshold;
    double value;

    public Alert(String metricName, double threshold, double value) {
        this.metricName = metricName;
        this.threshold = threshold;
        this.value = value;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public double getThreshold() {
        return threshold;
    }

    public void setThreshold(double threshold) {
        this.threshold = threshold;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
