import crypto from "crypto";
import {TOKEN} from "../app";

export default function (auth: string): string {
  try {
    const tokenParts = auth.split('.')
    const signature = crypto
      .createHmac('SHA256', TOKEN)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64')

    if (signature === tokenParts[2]) {
      return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))['id']
    }
  } catch (e) {
  }
  return ''
}