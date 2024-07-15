import {RequestHandler} from "express";

const handler: RequestHandler = (req, res, next) => {
  console.log(`Request "${req.url}" from "${req.ip}" at ${(new Date()).toLocaleTimeString()}`)
  next()
}

export default handler