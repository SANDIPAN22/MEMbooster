import express from "express";
import type { Express } from "express";
import { PORT, APP_ENV, MORGAN_MODE } from "./config";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./utils/connectDB";
import router from "./routes";

const app: Express = express();

// If in the server the app runs behind the proxies then setting the below will be helpful to debug
app.enable("trust proxy");

// middlewares setup time brother
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // this one is very risky it is allowing everyone, you need to white-list only necessary origins
app.use(morgan(MORGAN_MODE));

app.use(router);

app.listen(PORT, () => {
  console.log(
    `The Server is Up and Running at port ${PORT} in ${APP_ENV} mode.`,
  );
  connectDB();
});
