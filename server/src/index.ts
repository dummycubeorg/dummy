import express from "express";
import helmet from "helmet";
import cors from "cors";
import { v1Router } from "./routers/v1/v1.router";
import { env } from "./env";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", v1Router);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}...`);
});
