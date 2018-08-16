FROM maven:3.5.4-jdk-8

COPY ./docker/dubbo/dubbo-entrypoint.sh /

WORKDIR /django
RUN ["chmod", "+x", "/dubbo-entrypoint.sh"]
