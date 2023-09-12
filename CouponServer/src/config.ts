import { z } from "zod";

export const configSchema = z.object({
  PORT: z.coerce.number().int().min(1025).default(5000),
  DB_HOST: z.string().default("localhost"),
});

type Config = z.infer<typeof configSchema>;
export default Config;
