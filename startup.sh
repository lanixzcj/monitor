#!/bin/bash
source `which virtualenvwrapper.sh`
workon react
cd /home/lan/WebstormProjects/monitor
#npm run prod
cd src
python manage.py runserver 0.0.0.0:8000 > django.log  2>&1 &
celery -A monitor_settings  worker -B -l > celery.log info 2>&1 &
cd ..
