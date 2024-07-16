import {RequestHandler} from "express";
import {noRegisterUrls} from "../app";

const handler: RequestHandler = (req, res, next) => {
  try {
    if (req.id || noRegisterUrls.includes(req.url)) {
      return next()
    }
  } catch (e) {
  }
  return res.redirect('/express-proxy-auth/login-page')
}

export default handler