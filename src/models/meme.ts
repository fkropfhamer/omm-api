import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  url: String,
  name: String,
  views: Number,
  filename: String,
  id: String,
  likes: Number,
  secretMeme: {
    type: Boolean,
    default: false,
  },
  votes: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;
