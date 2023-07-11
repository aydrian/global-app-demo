import { cssBundleHref } from "@remix-run/css-bundle";
import { type LinksFunction, type LoaderArgs, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";

import i18next from "~/utils/i18next.server.ts";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { href: styles, rel: "stylesheet" },
  { href: "/assets/images/favicon.svg", rel: "icon", type: "image/svg+xml" },
  { href: "/assets/images/favicon.png", rel: "icon", type: "image/png" },
  ...(cssBundleHref ? [{ href: cssBundleHref, rel: "stylesheet" }] : [])
];

export async function loader({ request }: LoaderArgs) {
  let locale = await i18next.getLocale(request);
  return json({ locale });
}
export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common"
};

export default function App() {
  // Get the locale from the loader
  let { locale } = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);
  return (
    <html dir={i18n.dir()} lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
