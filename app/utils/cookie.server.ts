import { createCookie } from "@remix-run/node";

export const i18nextCookie = createCookie("i18next", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7, // 1 minute because it makes no sense to keep it for a long time
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
});
