import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().nonempty(),
  // Fly Environment Variables
  FLY_REGION: z.string().default("iad")
});

const env = envSchema.parse(process.env);
export default env;
