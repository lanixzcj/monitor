from __future__ import absolute_import, unicode_literals
import os
import django
from celery import Celery
from django.core.cache import cache
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "monitor_settings.settings.dev")
app = Celery('monitor_settings')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
app.conf.beat_schedule = {
    'clean_up_thread': {
        'task': 'monitor.tasks.clean_up',
        'schedule': 20.0,
        'args': ()
    },
    'scan_thread': {
        'task': 'monitor.tasks.scanning_host',
        'schedule': 120.0,
        'args': ()
    },
    #'send_email_thread': {
    #    'task': 'monitor.tasks.send_email',
    #    'schedule': 300.0,
    #    'args': ()
    #},
    #'data_mining_thread': {
    #    'task': 'data_mining.tasks.data_mining',
    #    'schedule': crontab(minute=0, hour=0),
    #    'args': ()
    #},
}


@app.on_after_configure.connect
def on_celery_start(sender, **kwargs):
    #app.send_task(name='monitor.tasks.server_thread')
    cache.delete('hosts')
    app.send_task(name='monitor.tasks.scanning_host')
    pass


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
