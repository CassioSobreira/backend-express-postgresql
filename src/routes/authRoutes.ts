import { Router, Request, Response } from 'express';
import * as authController from '../controllers/authController';
import { protect, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/protected', protect, (req: AuthRequest, res: Response) => {
  res.status(200).json({ 
    message: 'Acesso autorizado. Bem-vindo à área protegida!',
    userId: req.userId
  });
});

export default router;
