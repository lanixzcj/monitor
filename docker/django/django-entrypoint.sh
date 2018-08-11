#!/usr/bin/env bash

until cd src
do
    echo "Waiting for django volume..."
done

until python manage.py makemigrations
do
    echo "Waiting for mysql ready..."
    sleep 2
done

python manage.py makemigrations accounts
python manage.py makemigrations monitor
python manage.py migrate
python manage.py runserver 0.0.0.0:8000 > django.log  2>&1 &
celery -A monitor_settings  worker -B -l > celery.log info 2>&1 &
tail -f /dev/null 
