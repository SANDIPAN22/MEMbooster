import express from "express";
import type { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT, APP_ENV, MORGAN_MODE, ALLOWED_ORIGINS } from "./config";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
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
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
); //  white-listed only necessary origins only as we are setting credentials
app.use(cookieParser());
app.use(morgan(MORGAN_MODE));

app.use(router);

// app.listen(PORT, () => {
//   console.log(
//     `The Server is Up and Running at port ${PORT} in ${APP_ENV} mode. `,
//   );
//   connectDB();
// });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");
  // just for room joining
  socket.on("get-room-id", (roomId) => {
    socket.join(roomId);
  });
  // listen for changes if come then pass it to the particular room
  socket.on("send-changes", (delta, roomId) => {
    console.log("something is happening...", delta, roomId);
    socket.to(roomId).emit("receive-changes", delta);
  });
});

server.listen(8000, () => {
  console.log(
    `The Server is Up and Running at port ${PORT} in ${APP_ENV} mode. `,
  );
  connectDB();
});
