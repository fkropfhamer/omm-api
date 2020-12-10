import express from 'express';
import { authenticated } from '../../../authenticaton';
import userController from '../../../controller/api/v1/userController';

const router = express.Router();

router.put('/', userController.put);
router.post('/authenticate', userController.authenticate);
router.get('/me', authenticated, userController.me);

export default router;
