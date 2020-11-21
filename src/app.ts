import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors())

app.get('/api/v1/', (req, res) => res.json({status: 'ok'}))


export default app;
