import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLocale } from "remix-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "~/components/ui/card.tsx";
import { prisma } from "~/utils/db.server.ts";

export async function loader({ params }: LoaderArgs) {
  const { market } = params;

  const startDate = new Date();

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      amount: true,
      currency: true,
      id: true,
      market: true,
      name: true
    },
    where: { market }
  });

  return json({
    elapsed: new Date().getTime() - startDate.getTime(),
    products
  });
}

export default function ProductsMarket() {
  const { elapsed, products } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const locale = useLocale();
  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold leading-tight text-crl-deep-purple">
        {t("Menu")}{" "}
        <span className="text-base font-light text-gray-800">
          ({elapsed}ms)
        </span>
      </h2>
      <div className="flex flex-wrap items-center justify-start gap-4 sm:flex-row md:justify-around md:gap-8 lg:gap-16">
        {products.map((product) => (
          <Card className="w-48" key={product.id}>
            <CardHeader>
              <CardTitle>{t(product.name)}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-medium text-crl-electric-purple">
                {new Intl.NumberFormat(locale, {
                  currency: product.currency,
                  style: "currency"
                }).format(Number(product.amount))}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
