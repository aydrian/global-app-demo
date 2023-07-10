import { type LoaderArgs, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Github } from "lucide-react";
import { useLocale } from "remix-i18next";

import { prisma } from "~/utils/db.server.ts";
import env from "~/utils/env.server.ts";

export async function loader({ request }: LoaderArgs) {
  const markets = await prisma.product.groupBy({
    _count: { _all: true },
    by: ["market"],
    orderBy: { market: "asc" }
  });
  return json({ FLY_REGION: env.FLY_REGION, markets });
}

export default function ProductsLayout() {
  const { FLY_REGION, markets } = useLoaderData<typeof loader>();
  const locale = useLocale();
  return (
    <>
      <header className="fixed w-full">
        <div className="px-6 md:px-12 lg:px-36">
          <h1 className="p-4 text-center text-3xl font-bold leading-tight text-gray-900">
            RoachRoast 🪳☕️
          </h1>
        </div>
        <div className="flex w-full flex-wrap bg-crl-deep-purple p-2 pb-0 text-white md:px-12 lg:px-36">
          <div className="p-2 font-medium">Markets:</div>
          <nav className="flex gap-4">
            {markets.map(({ _count: { _all: count }, market }) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "rounded-t-md bg-crl-electric-purple p-2"
                    : "hover: p-2 hover:rounded-t-md hover:bg-crl-action-blue"
                }
                key={market}
                to={`./${market}`}
              >
                <span>{market.toUpperCase()}</span>
                <span className="hidden sm:inline"> ({count})</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-3.6rem)] px-6 pt-32 md:px-12 lg:px-36">
        <Outlet />
      </main>
      <footer className="flex items-center justify-between bg-crl-deep-purple p-4 text-sm font-bold text-white">
        <div className="flex flex-col text-xs">
          <span>Fly Region: {FLY_REGION}</span>
          <span>Locale: {locale}</span>
        </div>
        <a
          href="https://github.com/aydrian/global-app-demo"
          rel="noreferrer"
          target="_blank"
        >
          <Github size="32" />
          <span className="sr-only">GitHub Repo</span>
        </a>
      </footer>
    </>
  );
}
