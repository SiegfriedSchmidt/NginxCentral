import {RequestHandler} from "express";
import {loginPagePath} from "../app";

const handler: RequestHandler = (req, res, next) => {
  return res.render(loginPagePath, {loginUrl: '/express-proxy-auth/login', redirectUrl: '/express-proxy-auth/sites-page'});
}

export default handler