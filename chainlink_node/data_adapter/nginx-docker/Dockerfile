FROM ubuntu:latest

MAINTAINER Filip Macek

RUN apt-get update && apt-get install -y nginx curl

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

COPY nginx_proxy.conf /etc/nginx/sites-enabled/default

CMD ["nginx"]

EXPOSE 80