import { Router, Request, Response } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/protected', protect, (req: Request, res: Response) => {

  res.status(200).json({ message: 'Acesso autorizado. Bem-vindo à área protegida!' });
});

export default router;

