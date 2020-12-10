import express from 'express';
import templateController from '../../../controller/api/v1/templateController';

const router = express.Router();

router.post('/', templateController.post);

router.get('/', templateController.get);

router.get('/image/:id', templateController.image);

export default router;
