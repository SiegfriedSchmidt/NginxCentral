openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/default-ssl.key -out /etc/ssl/default-ssl.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

