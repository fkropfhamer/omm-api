import express from 'express';
import templateRouter from './templateRouter';
import userRouter from './userRouter';
import memeRouter from './memeRouter';

const router = express.Router();

router.get('/', (req, res) => res.json({status: 'ok'}));

router.use('/user', userRouter);

router.use('/template', templateRouter);

router.use('/meme', memeRouter);

export default router;
