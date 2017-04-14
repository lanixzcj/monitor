# -*- coding: UTF-8 -*-
import traceback

from celery import shared_task
from execute import execute
from genefunc import genefunc
from apriorifunc import apriori


# 挖掘任务
@shared_task
def data_mining():
    execute()
    genefunc()
    apriori()



