import {
  Prisma,
  PrismaClient,
  type crdb_internal_region
} from "@prisma/client";

import i18n from "./data/i18n.json";
import products from "./data/products.json";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([
    // Add Products
    prisma.product.createMany({
      data: products.map(({ amount, crdb_region, ...product }) => ({
        amount: new Prisma.Decimal(amount),
        crdb_region: crdb_region as crdb_internal_region,
        ...product
      }))
    }),
    // Add Transations
    prisma.i18n.createMany({
      data: i18n
    })
  ]);
}

seed();
