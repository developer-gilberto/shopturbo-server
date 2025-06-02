import express, { Response } from 'express';
import { router } from './routes/router';
import helmet from 'helmet';
import cors from 'cors';

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());
server.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production' || 'homolog'
                ? 'https://shopturbo-server.onrender.com'
                : '*',
        credentials:
            process.env.NODE_ENV === 'production' || 'homolog' ? true : false,
    })
);

server.use(router);

server.get('/', (_req, res: Response) => {
    res.status(200).json({ message: 'Hello world!' });
});

server.listen(process.env.PORT, () => {
    console.info('\x1b[1m\x1b[32m-> Server is running :) \x1b[0m');
});
