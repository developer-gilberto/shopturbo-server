import cors from "cors";
import helmet from "helmet";
import express from "express";
import { router } from "./routes/router";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());
server.use(
    cors({
        origin:
            process.env.NODE_ENV === "production" || "homolog"
                ? "https://shopturbo-server.onrender.com"
                : "*",
        credentials:
            process.env.NODE_ENV === "production" || "homolog" ? true : false,
    }),
);

server.use(router);

server.listen(process.env.PORT, () => {
    console.info("\x1b[1m\x1b[32m-> Server is running :) \x1b[0m");
});
