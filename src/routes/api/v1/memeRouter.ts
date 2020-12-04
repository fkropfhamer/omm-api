import express from 'express';
import memeController from '../../../controller/api/v1/memeController';


const router = express.Router();

router.post('/', memeController.post);

router.get('/', memeController.get);

export default router;
