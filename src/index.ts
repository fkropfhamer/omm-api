import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 8000;

app.use(cors())

app.get('/api/v1/', (req, res) => res.json({status: 'ok'}))

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
