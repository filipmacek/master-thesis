FROM ubuntu:latest

MAINTAINER Filip Macek

ENV PROJECTDIR=/home/app
ENV FRONTENDDIR=/home/app/frontend

RUN apt-get update && apt-get install -y nginx curl net-tools

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf;

WORKDIR $FRONTENDDIR

COPY . .
RUN rm -rf node_modules/
RUN rm /etc/nginx/sites-enabled/default
COPY frontend_nginx.conf /etc/nginx/sites-enabled

CMD ["nginx"]

EXPOSE 80