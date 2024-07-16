import express, {RequestHandler} from "express";
import * as http from "http";
import * as https from "https";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import verifyTokenMiddleware from "./middlewares/verifyTokenMiddleware";
import restrictAccessMiddleware from "./middlewares/restrictAccessMiddleware";
import mainRouter from "./routers/mainRouter";
import sha256 from "./utils/sha256";
import path from "path";
import generateRandom from "./utils/generateRandom";
import {readFileSync} from "fs";
import proxyToSiteMiddleware from "./middlewares/proxyToSiteMiddleware";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import * as ejs from "ejs"
import NoCacheHeadersMiddleware from "./middlewares/NoCacheHeadersMiddleware";

const PORT = Number(process.env.PORT) || 9449
const ENV = process.env.NODE_ENV || 'development';
const PROTOCOL = ENV === 'development' ? "https" : "http"
const HOSTNAME = ENV === 'development' ? "192.168.1.15" : "0.0.0.0"

export const SITES: { [key: string]: RequestHandler } = {
  'hse': proxy('https://hse.noons.ru'),
  'reminder': proxy('https://reminder.noons.ru')
}

// proxy('https://google.com', {
//   proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
//     if (proxyReqOpts && proxyReqOpts.headers) {
//       proxyReqOpts.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
//       proxyReqOpts.headers['Pragma'] = 'no-cache';
//       proxyReqOpts.headers['Expires'] = '0';
//     }
//     return proxyReqOpts
//   }
// })

export const noRegisterUrls = ['/express-proxy-auth/login-page', '/express-proxy-auth/login']
export const STATIC = path.join(__dirname, '../html')
export const loginPagePath = path.join(STATIC, '/loginPage.html')
export const sitesPagePath = path.join(STATIC, '/sitesPage.html')
export const TOKEN = process.env.TOKEN || generateRandom()
export const PASSWORD = process.env.PASSWORD ? sha256(sha256(process.env.PASSWORD)) : 'lE8TIJicCXMGxqb+vAo8DLg5yfqFxtbZR1prErM1DVU='

const app = express()
const server = PROTOCOL === 'https'
  ?
  https.createServer({
    key: readFileSync("certs/tls.key"),
    cert: readFileSync("certs/tls.crt"),
    ca: readFileSync("certs/tls.csr"),
  }, app)
  :
  http.createServer(app)

// set the view engine to ejs
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// my middleware
app.use(loggerMiddleware)
app.use(verifyTokenMiddleware)
app.use(restrictAccessMiddleware)

// routers
app.use('/express-proxy-auth', mainRouter)

// sites
app.use(NoCacheHeadersMiddleware);
app.use(proxyToSiteMiddleware)

server.listen(PORT, HOSTNAME, () => console.info(`Server running on ${PROTOCOL}://${HOSTNAME}:${PORT} in ${ENV} mode`));