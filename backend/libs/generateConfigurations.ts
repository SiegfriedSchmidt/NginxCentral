import * as fs from "fs";
import path from "path";
import {RequestHandler} from "express";
import proxy from "express-http-proxy";
import {configType} from "./types/configType";

export default function generateConfigurations() {
  const confFile = process.env.CONF_FILE || '../sites.json';
  const nginxConfDirectory = process.env.NGINX_CONF_DIRECTORY || '../central-nginx-data/conf.d';
  const config: configType = JSON.parse(fs.readFileSync(confFile, 'utf8'))

  const SITES: { [key: string]: RequestHandler } = {}

  config.forEach((site) => {
    if (site.protected) {
      SITES[site.name] = proxy(site.proxyPass)
    } else {
      createNginxConf(site.name, site.serverName, site.sslCertificate, site.proxyPass, nginxConfDirectory)
    }
  })

  return SITES
}

function createNginxConf(name: string, serverName: string, sslCertificate: string, proxyPass: string, confDir: string) {
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir)
  }

  fs.writeFileSync(path.join(confDir, `${name}.conf.template`), `
server {
    listen 443 ssl;
    server_name ${serverName};
    ssl_certificate /etc/letsencrypt/live/${sslCertificate}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${sslCertificate}/privkey.pem;

    location / {
        proxy_pass ${proxyPass};
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_buffering on;
    }
}
`)
}