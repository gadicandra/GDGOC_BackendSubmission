import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';

export const createMenusRoutes = (handler: any) => {
  const router = Router();

  router.post('/', authMiddleware, handler.postMenuHandler);
  router.get('/', handler.getMenusHandler);
  router.get('/group-by-category', handler.getMenusByCategoryModeHandler);
  router.get('/:id', handler.getMenuByIdHandler);
  router.get('/:query', handler.getMenusByQuery);
  router.put('/:id', authMiddleware, handler.editMenuByIdHandler);
  router.delete('/:id', authMiddleware, handler.deleteMenuByIdHandler);

  return router;
}