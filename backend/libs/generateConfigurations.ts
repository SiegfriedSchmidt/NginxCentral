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
      SITES[site.name] = proxy(site.proxyPass, {
        proxyReqPathResolver: function (req) {
          return req.originalUrl;
        },
        proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
          if (proxyReqOpts.headers) {
            proxyReqOpts.headers['Upgrade'] = srcReq.headers['upgrade'] || '';
            proxyReqOpts.headers['Connection'] = srcReq.headers['connection'] || '';
            proxyReqOpts.headers['Host'] = srcReq.headers['host'];
          }
          return proxyReqOpts;
        },
        userResHeaderDecorator: function (headers) {
          headers['Access-Control-Allow-Origin'] = 'https://protected.noons.ru';
          headers['Access-Control-Allow-Credentials'] = 'true';
          return headers;
        }
      })
    } else {
      createNginxConf(site.name, site.serverName, site.sslCertificate, site.sslCertificateKey, site.proxyPass, nginxConfDirectory)
    }
  })

  return SITES
}

function createNginxConf(name: string, serverName: string, sslCertificate: string, sslCertificateKey: string, proxyPass: string, confDir: string) {
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir)
  }

  fs.writeFileSync(path.join(confDir, `${name}.conf`), `
server {
    listen 443 ssl;
    server_name ${serverName};
    ssl_certificate ${sslCertificate};
    ssl_certificate_key ${sslCertificateKey};

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