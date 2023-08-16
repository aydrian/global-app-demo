import { type TypeOf, z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}

const zodEnv = z.object({
  // Database
  DATABASE_URL: z.string(),
  // Fly Environment Variables
  FLY_REGION: z.string().default("iad")
});

try {
  zodEnv.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field
      )
      .join("\n ");

    throw new Error(`Missing environment variables:\n  ${errorMessage}`);

    process.exit(1);
  }
}
