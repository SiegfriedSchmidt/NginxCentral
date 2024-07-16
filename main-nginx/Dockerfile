FROM nginx:stable
COPY ./generate-default-ssl.sh /docker-entrypoint.d
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d
COPY ./www /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/generate-default-ssl.sh

