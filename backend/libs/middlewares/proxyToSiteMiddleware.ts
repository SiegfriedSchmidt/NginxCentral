import {RequestHandler} from "express";
import {SITES} from "../app";

const handler: RequestHandler = (req, res, next) => {
  try {
    const site = req.cookies.site
    return SITES[site](req, res, next)
  } catch (e) {
  }
}

export default handler