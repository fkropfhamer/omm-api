import express from 'express';
import userController from '../../../controller/api/v1/userController';

const router = express.Router();

router.put('/user', userController.put);

export default router;
