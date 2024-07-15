export default function readCookie(val: string, cookie: string | undefined) {
  if (!cookie) return ''
  const cookieToken = cookie.split("; ").find((row) => row.startsWith(`${val}=`))
  if (!cookieToken) return ''
  return cookieToken.slice(val.length + 1);
}
