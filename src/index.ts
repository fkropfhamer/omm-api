import app from './app';
import { connectDb } from './db';

const PORT = 8000;

connectDb().then(async () => {
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });    
});
