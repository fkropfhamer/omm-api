import express from 'express';
import memeController from '../../../controller/api/v1/memeController';


const router = express.Router();

router.post('/', memeController.post);

router.get('/', memeController.get);

router.get('/image/:id', memeController.image);

export default router;
