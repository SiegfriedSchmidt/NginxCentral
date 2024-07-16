import {RequestHandler} from "express";
import {SITES, sitesPagePath} from "../app";

const handler: RequestHandler = (req, res, next) => {
  return res.render(sitesPagePath, {sites: Object.keys(SITES)})
}

export default handler