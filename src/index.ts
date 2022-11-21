import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import appRoutes from './routes/index';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/error';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', appRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

//middlewares
app.use(errorHandler);
app.use(notFound);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
