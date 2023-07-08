import type { LinksFunction, LoaderArgs } from "@remix-run/node";

import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import acceptLanguage from "accept-language-parser";

import { LocaleProvider } from "./hooks/use-locale.tsx";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { href: styles, rel: "stylesheet" },
  ...(cssBundleHref ? [{ href: cssBundleHref, rel: "stylesheet" }] : [])
];

export async function loader({ request }: LoaderArgs) {
  const languages = acceptLanguage.parse(
    request.headers.get("Accept-Language") as string
  );

  // If somehow the header is empty, return a default locale
  if (languages?.length < 1) return "en-us";

  // If there is no region for this locale, just return the code
  if (!languages[0].region) return languages[0].code;

  return `${languages[0].code}-${languages[0].region.toLowerCase()}`;
}

export default function App() {
  const locale = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <Outlet />
        </LocaleProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
