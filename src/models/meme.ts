import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  url: String,
  name: String,
  views: Number,
  filename: String,
  id: String,
  likes: Number,
  votes: Number,
});

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;
