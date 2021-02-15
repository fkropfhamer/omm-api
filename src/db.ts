import mongoose from 'mongoose';

export function connectDb() {
    const db_uri = process.env.MONGODB_URI || "localhost";

    return mongoose.connect(`mongodb://${db_uri}/memes`, {useNewUrlParser: true, useUnifiedTopology: true});
};

