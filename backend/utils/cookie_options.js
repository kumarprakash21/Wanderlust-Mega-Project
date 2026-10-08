export const accessCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: Number(process.env.ACCESS_COOKIE_MAXAGE) || 120000,
  path: '/',
};
export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: Number(process.env.REFRESH_COOKIE_MAXAGE) || 120000,
  path: '/',
};
