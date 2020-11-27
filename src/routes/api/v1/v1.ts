import express from 'express';
import * as template from './template';
import * as user from './user';
import * as meme from './meme';

const router = express.Router();

router.get('/', (req, res) => res.json({status: 'ok'}));

router.use('/user', user.default);

router.use('/template', template.default);

router.use('/meme', meme.default);

export default router;
