#!/bin/bash
fuser -k 8000/tcp
ps auxww | grep 'celery -A monitor_settings worker -B -l info' | awk '{print $2}' | xargs kill -9
