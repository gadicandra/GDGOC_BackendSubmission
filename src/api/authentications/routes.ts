import { Router } from 'express';

export const createAuthRoutes = (handler: any) => {
  const router = Router();

  router.post('/', handler.postAuthenticationHandler);
  router.put('/', handler.putAuthenticationHandler);
  router.delete('/', handler.deleteAuthenticationHandler);

  return router;
};