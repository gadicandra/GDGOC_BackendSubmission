import ClientError from './exceptions/ClientError';
import express, { Express, Request, Response, NextFunction } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const init = async () => {
  const app: Express = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
      res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
      return;
    }

    // Server Error
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
  });

  app.listen(port, () => {
    console.log(`Server berjalan pada http://${process.env.HOST}:${port}`);
  });
};

init();