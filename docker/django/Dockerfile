FROM ubuntu:16.04

ENV PYTHONUNBUFFERED 1

COPY ./docker/django/django-entrypoint.sh /
COPY ./py-requirements /django/py-requirements
COPY ./docker/django/pip.conf /etc/pip.conf

WORKDIR /django

RUN cd /etc/apt && mv sources.list sources.list.backup 
COPY ./docker/django/sources.list /etc/apt/
RUN apt-get update && apt-get install git-core librrd-dev python-pip python-dev curl build-essential openssl libmysqlclient-dev -y
RUN pip install pip==18.0
RUN pip install -r py-requirements/requirements.txt

RUN ["chmod", "+x", "/django-entrypoint.sh"]
