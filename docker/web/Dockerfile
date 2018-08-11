FROM node:8

COPY ./docker/web/web-entrypoint.sh /
COPY ./package.json /django/package.json
COPY ./webpack /django/
ENV NPM_CONFIG_LOGLEVEL info

WORKDIR /django

RUN npm config set registry https://registry.npm.taobao.org
RUN npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
RUN npm install -g webpack@2.2.1
RUN npm install

RUN ["chmod", "+x", "/web-entrypoint.sh"]
