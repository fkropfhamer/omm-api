import mongoose from 'mongoose';

export function connectDb() {
    return mongoose.connect('mongodb://localhost/memes', {useNewUrlParser: true, useUnifiedTopology: true});
};

