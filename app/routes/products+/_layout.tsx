import { type LoaderArgs, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import * as pkg from "remix-i18next";
// import { useLocale } from "remix-i18next";

import { prisma } from "~/utils/db.server.ts";
import env from "~/utils/env.server.ts";

const { useLocale } = pkg;

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
          <nav className="flex gap-4">
            <div className="font-medium">Market:</div>
            {markets.map(({ _count: { _all: count }, market }) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-700" : undefined
                }
                key={market}
                to={`./${market}`}
              >
                {market.toUpperCase()} ({count})
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-3rem)] px-6 pt-32 md:px-12 lg:px-36">
        <Outlet />
      </main>
      <footer className="flex items-center justify-between bg-black p-4 text-sm font-bold text-white">
        <span>Fly Region: {FLY_REGION}</span>
        <span>Locale: {locale}</span>
      </footer>
    </>
  );
}
