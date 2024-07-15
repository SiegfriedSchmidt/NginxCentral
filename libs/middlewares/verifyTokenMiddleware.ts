import verifyTokenService from "../services/verifyTokenService";
import {RequestHandler} from "express";
import readCookie from "../utils/readCookie";

const handler: RequestHandler = (req, res, next) => {
  try {
    const token = readCookie('token', req.headers.cookie)
    req.id = verifyTokenService(token)
  } catch (e) {
  } finally {
    next()
  }
}

export default handler