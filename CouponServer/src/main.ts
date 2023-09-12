import express, { json } from "express";
import routes from "./routes/routes";
import { configSchema } from "./config";

const configResult = configSchema.safeParse(process.env);

if (!configResult.success) {
  console.error(
    configResult.error.issues.map(({ message }) => message).join("\n")
  );
  process.exit(1);
}

const config = configResult.data;

const app = express();
app.use(json());

app.use("/", routes(config));

app.listen(config.PORT, "0.0.0.0", () => {
  console.log("listening on port", config.PORT);
});
