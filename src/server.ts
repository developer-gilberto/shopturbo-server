import express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/', (_req, res: Response) => {
    res.status(200).json({ message: 'Hello world!' });
});

server.listen(process.env.PORT, () => {
    console.info('-> Server is running :) ');
});
