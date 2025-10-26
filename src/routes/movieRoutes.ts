import { Router } from 'express';
import * as movieController from '../controllers/movieController';
import { protect } from '../middlewares/authMiddleware'; 

const router = Router();


router.use(protect);

router.post('/', movieController.create);

router.get('/', movieController.getAll);

router.get('/:id', movieController.getById);

router.put('/:id', movieController.update);

router.patch('/:id', movieController.update); 

router.delete('/:id', movieController.remove);

export default router;

