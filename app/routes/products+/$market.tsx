import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "~/components/ui/card.tsx";
import useLocale from "~/hooks/use-locale.tsx";
import { prisma } from "~/utils/db.server.ts";

export async function loader({ params }: LoaderArgs) {
  const { market } = params;

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

  return json({ products });
}

export default function ProductsMarket() {
  const { products } = useLoaderData<typeof loader>();
  const locale = useLocale();
  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold leading-tight text-gray-700">
        Products
      </h2>
      <div className="flex flex-wrap items-center justify-start gap-4 sm:flex-row md:justify-around md:gap-8 lg:gap-16">
        {products.map((product) => (
          <Card className="w-48" key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {new Intl.NumberFormat(locale, {
                currency: product.currency,
                style: "currency"
              }).format(Number(product.amount))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
