import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  url: String,
  name: String,
  filename: String,
  id: String,
  author: {
    type: String,
    default: "email@dummy.com",
  },
  tags: [String],
  fileformat: {
    type: String,
    default: "jpg",
  },

  views: {
    type: Number,
    default: 0,
  },

  votes: {
    type: Array,
    default: [],
  },
  comments: [String],
  secretMeme: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;
