import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { router } from './routes/router';

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());
server.use(cookieParser());

server.use((req, _res, next) => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'homolog'
  ) {
    console.info('[ Headers ]: ', req.headers);
    return next();
  }
  return next();
});

server.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'homolog'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',

    credentials: true,
  })
);

server.use(router);

server.listen(process.env.PORT, () => {
  console.info('\x1b[1m\x1b[32m-> Server is running :) \x1b[0m');
});
