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
from django.conf.urls import url, include
from django.contrib import admin
from monitor import views as server_view

admin.site.site_header = u'网络监控平台'


urlpatterns = [
    url(r'^$', server_view.home),
    url(r'^trusted_hosts/', server_view.trusted_hosts),
    url(r'^ss/', server_view.home_host_info),
    url(r'^user/$', server_view.get_user),
    url(r'^monitor/(?P<monitor_type>[\w_-]+)/(?P<host>[\w_-]+)', server_view.monitor_data),
    url(r'^strategy/device/(?P<host>[\w_-]+)', server_view.device_strategy),
    url(r'^strategy/(?P<strategy_type>[\w_-]+)/(?P<host>[\w_-]+)', server_view.strategy_data),
    url(r'^hostgraph/$', server_view.host_graphs),
    url(r'^hostgraph/(?P<monitor_info>\w+)$', server_view.get_monitor_data),
    url(r'^safe_strategy/$', server_view.safe_strategy),
    url(r'^safe_strategy/(?P<strategy_method>\w+)$', server_view.strategy_method),
    url(r'^(?:hostgraph/)?image/$', server_view.image),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', server_view.login),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
