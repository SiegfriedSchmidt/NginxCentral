import makeJWTService from "../services/makeJWTService";
import serverStatuses from "../types/serverStatuses";
import sha256 from "../utils/sha256";
import {PASSWORD} from "../app";
import {RequestHandler} from "express";
import generateRandom from "../utils/generateRandom";

const handler: RequestHandler = (req, res, next) => {
  try {
    if (req.id) return res.status(serverStatuses.Error).send('You are already authenticated')
    if (!(req.body.password)) return res.status(serverStatuses.Error).send('Password is empty')

    const hashPassword = sha256(req.body.password.toString())
    if (hashPassword === PASSWORD) {
      const token = makeJWTService({id: generateRandom()})
      res.cookie('token', token, {httpOnly: true, sameSite: true, secure: true, encode: String})
      res.status(serverStatuses.OK).send('Success')
    } else {
      res.status(serverStatuses.Error).send('Wrong password')
    }
  } catch (e) {
    console.log(e)
  }
}

export default handler
