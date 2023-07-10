import { type LoaderArgs, json } from "@remix-run/node";

import { prisma } from "~/utils/db.server.ts";

export async function loader({ params }: LoaderArgs) {
  const { lng = "en" } = params;
  const result = await prisma.i18n.findMany({
    select: { translation: true, word: true },
    where: { lang: lng }
  });
  const resources = result.reduce((obj, { translation, word }) => {
    return {
      ...obj,
      [word]: translation
    };
  }, {});
  return json(resources);
}
