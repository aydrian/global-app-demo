import { type LoaderArgs, json } from "@remix-run/node";

import { prisma } from "~/utils/db.server.ts";

export async function loader({ params }: LoaderArgs) {
  const { lng = "en" } = params;
  const result = await prisma.i18n.findMany({
    select: { key: true, translation: true },
    where: { language: lng }
  });
  const resources = result.reduce((obj, { key, translation }) => {
    return {
      ...obj,
      [key]: translation
    };
  }, {});
  return json(resources);
}
