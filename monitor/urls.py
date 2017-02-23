# -*- coding: UTF-8 -*-
"""celery_test URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from data_process import views as server_view

admin.site.site_header = u'网络监控平台'
urlpatterns = [
    url(r'^$', server_view.home),
    url(r'^hostgraph/$', server_view.host_graphs),
    url(r'^hostgraph/get_warnings$', server_view.get_warnings),
    url(r'^hostgraph/get_ippackets$', server_view.get_ippackets),
    url(r'^hostgraph/get_mediainfo$', server_view.get_mediainfo),
    url(r'^hostgraph/get_fileinfo$', server_view.get_fileinfo),
    url(r'^hostgraph/get_processinfo$', server_view.get_processinfo),
    url(r'^safe_strategy/$', server_view.safe_strategy),
    url(r'^safe_strategy/get_ippackets_rules$', server_view.get_ippackets_rules),
    url(r'^safe_strategy/get_file_rules$', server_view.get_file_rules),
    url(r'^(?:hostgraph/)?image/$', server_view.image),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', server_view.login),
]
