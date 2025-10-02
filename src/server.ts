import cors from "cors";
import helmet from "helmet";
import express from "express";
import { router } from "./routes/router";
import cookieParser from "cookie-parser";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());
server.use(cookieParser());

server.use((req, res, next) => {
    console.info("Origin received: ", req.headers.origin);
    next();
});

server.use(
    cors({
        origin:
            process.env.NODE_ENV === "production" ||
            process.env.NODE_ENV === "homolog"
                ? process.env.FRONTEND_URL
                : "http://localhost:3000",

        credentials: true,
    }),
);

server.use(router);

server.listen(process.env.PORT, () => {
    console.info("\x1b[1m\x1b[32m-> Server is running :) \x1b[0m");
});
