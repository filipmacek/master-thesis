FROM arm32v7/ubuntu

MAINTAINER Filip Macek

# Create User admin
# RUN adduser -ms /bin/bash admin

# basic apps
RUN apt-get update && apt-get install -y git curl iputils-ping


# # python/django depeVndencies
RUN apt-get install -y python3-dev python3-pip build-essential supervisor nginx libpq-dev uwsgi-plugin-python3 libcurl4-openssl-dev supervisor
RUN pip3 install -U pip setuptools
RUN pip3 install uwsgi

 # Copy and install first python requirements so docker will cache them
WORKDIR /home/admin/django_api
COPY  . .
RUN pip3 install -r requirements.txt

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN cp ./config/backend_nginx.conf /etc/nginx/sites-available/default
RUN cp ./config/supervisord.conf /etc/supervisor/conf.d
RUN cp ./config/uwsgi.ini .
RUN cp ./config/uwsgi_params .


ENTRYPOINT ["supervisord","-n"]
