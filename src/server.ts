// General Import
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Authentications
import AuthenticationsService from './services/supabase/databaseService/AuthenticationsService';
import { TokenManager } from './tokenize/TokenManager';
import AuthenticationsValidator from './validator/authentications';
import AuthenticationsHandler from './api/authentications/handler';
import { createAuthRoutes } from './api/authentications/routes';

// Users
import UsersService from './services/supabase/databaseService/UsersService';
import UsersHandler from './api/users/handler';
import { UsersValidator } from './validator/users';
import { createUsersRoutes } from './api/users/routes';

// Menus
import MenusService from './services/supabase/databaseService/MenusService';
import MenusHandler from './api/menu/handler';
import { MenusValidator } from './validator/menu';
import { createMenusRoutes } from './api/menu/routes';

// Error Import
import ClientError from './exceptions/ClientError';

const app: Express = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Service
const authenticationsService = new AuthenticationsService();
const usersService = new UsersService();
const menusService = new MenusService();

// Handler
const authenticationsHandler = new AuthenticationsHandler(
  authenticationsService,
  usersService,
  TokenManager,
  AuthenticationsValidator
);
const usersHandler = new UsersHandler(usersService, UsersValidator);
const menusHandler = new MenusHandler(menusService, MenusValidator);

// Router
const authRouter = createAuthRoutes(authenticationsHandler);
const usersRouter = createUsersRoutes(usersHandler);
const menusRouter = createMenusRoutes(menusHandler);

// Routing
app.use('/authentications', authRouter);
app.use('/users', usersRouter);
app.use('/menu', menusRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    const host = process.env.HOST || 'localhost';
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
}

export default app;