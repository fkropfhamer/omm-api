import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
    url: String,
    name: String,
});

const Meme = mongoose.model('Meme', memeSchema);

export default Meme;