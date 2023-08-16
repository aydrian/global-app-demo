import { type LoaderArgs, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Github } from "lucide-react";
import { useLocale } from "remix-i18next";

import CoffeeBean from "~/components/coffee-bean.tsx";
import { LanguageSwitcher } from "~/components/language-switcher.tsx";
import { prisma } from "~/utils/db.server.ts";

export async function loader({ request }: LoaderArgs) {
  const result = await prisma.$queryRaw<
    { gateway_region: string }[]
  >`SELECT gateway_region();`;

  const langs = [
    { text: "🇨🇳 中文", value: "zh" },
    { text: "🇺🇸 English", value: "en" },
    { text: "🇩🇪 Deutsch", value: "de" },
    { text: "🇯🇵 日本語", value: "ja" },
    { text: "🇪🇸 español", value: "es" }
  ];

  const markets = [
    { code: "de", name: "Germany" },
    { code: "mx", name: "Mexico" },
    { code: "uk", name: "United Kingdom" },
    { code: "us", name: "United States" }
  ];

  return json({
    CRDB_GATEWAY_REGION: result[0].gateway_region,
    FLY_REGION: process.env.FLY_REGION,
    langs,
    markets
  });
}

export default function ProductsLayout() {
  const { CRDB_GATEWAY_REGION, FLY_REGION, langs, markets } =
    useLoaderData<typeof loader>();

  const locale = useLocale();

  return (
    <>
      <header className="fixed w-full bg-white">
        <div className="flex items-center justify-center px-6 py-2 md:px-12 lg:px-36">
          <CoffeeBean className="mr-2 h-8 w-auto text-amber-950" />
          <h1 className="text-center text-3xl font-bold leading-tight text-crl-deep-purple">
            RoachRoast
          </h1>
        </div>
        <div className="flex w-full flex-wrap bg-crl-deep-purple p-2 pb-0 text-white md:px-12 lg:px-36">
          <nav className="mx-auto flex gap-4">
            {markets.map(({ code, name }) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "rounded-t-md bg-crl-electric-purple p-2"
                    : "hover: p-2 hover:rounded-t-md hover:bg-crl-action-blue"
                }
                key={code}
                to={`./${code}`}
              >
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">{code.toUpperCase()}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4.6rem)] px-6 pt-32 md:px-12 lg:px-36">
        <Outlet />
      </main>
      <footer className="flex items-center justify-between bg-crl-deep-purple p-4 text-sm font-bold text-white">
        <div className="flex flex-col text-xs">
          <span>CockroachDB Region: {CRDB_GATEWAY_REGION}</span>
          <span>Fly Region: {FLY_REGION}</span>
          <span>Locale: {locale}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher languages={langs} name="lng" />
          <a
            href="https://github.com/aydrian/global-app-demo"
            rel="noreferrer"
            target="_blank"
          >
            <Github size="32" />
            <span className="sr-only">GitHub Repo</span>
          </a>
        </div>
      </footer>
    </>
  );
}
