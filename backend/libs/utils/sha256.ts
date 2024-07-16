import crypto from "crypto";

export default function (message: string) {
  return crypto.createHash('sha256').update(message).digest('base64')
}