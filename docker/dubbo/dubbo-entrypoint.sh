#!/usr/bin/env bash

until cd services
do
    echo "Waiting for django volume..."
done
#mvn package
java -jar ./alert/target/alert-1.0.jar 2>&1 &
java -jar ./tsdb/target/tsdb-1.0.jar 2>&1 &
sleep 15
java -jar ./monitor/target/monitor-1.0.jar 2>&1 &
tail -f /dev/null 
