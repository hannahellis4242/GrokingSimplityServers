import express, { json } from "express";
import { z } from "zod";
import routes from "./routes/routes";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1025),
});

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error(envServer.error.issues);
  process.exit(1);
}

const app = express();
app.use(json());

app.use("/", routes);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("listening on port", process.env.PORT);
});
