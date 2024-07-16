import verifyTokenService from "../services/verifyTokenService";
import {RequestHandler} from "express";

const handler: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies.token
    req.id = verifyTokenService(token)
  } catch (e) {
  } finally {
    next()
  }
}

export default handler