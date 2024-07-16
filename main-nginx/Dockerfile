FROM nginx:stable
COPY ./generate-default-ssl.sh /docker-entrypoint.d
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./templates /etc/nginx/templates
COPY ./www /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/generate-default-ssl.sh

