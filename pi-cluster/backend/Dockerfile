FROM arm32v7/ubuntu
MAINTAINER Filip Macek

ENV BACKENDDIR=/home/admin/backend


# basic apps
RUN apt-get update && apt-get install -y git curl iputils-ping vim postgresql postgresql-contrib net-tools

# python/django dependencies
RUN apt-get install -y python3-dev python3-pip build-essential supervisor nginx libpq-dev uwsgi-plugin-python3 libcurl4-openssl-dev supervisor
RUN pip3 install -U pip setuptools
RUN pip3 install uwsgi

# Copy and install first python requirements so docker will cache them
WORKDIR $BACKENDDIR
COPY . .
RUN pip3 install -r requirements.txt



# Serve it with nginx/uwsgi
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN cp ./config/backend_nginx.conf /etc/nginx/sites-available/default
RUN cp ./config/supervisord.conf /etc/supervisor/conf.d
RUN cp ./config/uwsgi.ini $BACKENDDIR
RUN cp ./config/uwsgi_params $BACKENDDIR

CMD ["supervisord","-n"]
