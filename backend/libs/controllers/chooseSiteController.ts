import serverStatuses from "../types/serverStatuses";
import {RequestHandler} from "express";
import {SITES} from "../app";

const handler: RequestHandler = (req, res, next) => {
  try {
    if (!(req.body.site) || !(req.body.site in SITES)) return res.status(serverStatuses.Error).send('Invalid site!');
    res.cookie('site', req.body.site, {httpOnly: true, sameSite: true, secure: true, encode: String})
    res.status(serverStatuses.OK).send('Success')
  } catch (e) {
    console.log(e)
  }
}

export default handler
