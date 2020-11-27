import express from 'express';
import cors from 'cors';
import * as apiV1 from './routes/api/v1/v1';
import fileUpload from 'express-fileupload';

const app = express();

app.use(cors())

app.use(fileUpload({
    createParentPath: true
}));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/status', (req, res) => res.json({status: 'ok'}));

app.use('/api/v1', apiV1.default)


export default app;
