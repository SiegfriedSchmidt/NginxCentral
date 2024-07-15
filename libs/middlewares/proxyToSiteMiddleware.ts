import {RequestHandler} from "express";
import readCookie from "../utils/readCookie";
import {SITES} from "../app";

const handler: RequestHandler = (req, res, next) => {
  try {
    const site = readCookie('site', req.headers.cookie)
    return SITES[site](req, res, next)
  } catch (e) {
  }
}

export default handler