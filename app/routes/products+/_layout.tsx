import { type LoaderArgs, json } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useSubmit
} from "@remix-run/react";
import { Github } from "lucide-react";
import { useLocale } from "remix-i18next";

import CoffeeBean from "~/components/coffee-bean.tsx";
import { Button } from "~/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select.tsx";
import { prisma } from "~/utils/db.server.ts";
import env from "~/utils/env.server.ts";

export async function loader({ request }: LoaderArgs) {
  const result = await prisma.$queryRaw<
    { gateway_region: string }[]
  >`SELECT gateway_region();`;

  const markets = [
    { code: "de", name: "Germany" },
    { code: "mx", name: "Mexico" },
    { code: "uk", name: "United Kingdom" },
    { code: "us", name: "United States" }
  ];

  return json({
    CRDB_GATEWAY_REGION: result[0].gateway_region,
    FLY_REGION: env.FLY_REGION,
    markets
  });
}

export default function ProductsLayout() {
  const { CRDB_GATEWAY_REGION, FLY_REGION, markets } =
    useLoaderData<typeof loader>();

  const locale = useLocale();
  const submit = useSubmit();
  const location = useLocation();

  function handleLangChange(lang: string) {
    submit(
      { lng: lang, pathname: location.pathname },
      { action: location.pathname, method: "GET" }
    );
  }

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
          <Form
            action={location.pathname}
            className="flex gap-1 text-black"
            method="GET"
          >
            <Select
              defaultValue={locale}
              name="lng"
              onValueChange={handleLangChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">🇨🇳 中文</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                <SelectItem value="es">🇪🇸 español</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary">
              Go
            </Button>
          </Form>
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
