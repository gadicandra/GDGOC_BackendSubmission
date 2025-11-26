import { Router } from 'express';

export const createUsersRoutes = (handler: any) => {
    const router = Router();

    router.post('/', handler.postUserHandler);

    return router;
}