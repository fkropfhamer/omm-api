import mongoose from "mongoose";

export function connectDb() {
  const DB_local = "mongodb://localhost/memes";
  const DB_cloud =
    "mongodb+srv://ommproject20202021:omm20202021@cluster0.zugan.mongodb.net/ommproject20202021?retryWrites=true&w=majority";
  return mongoose
    .connect(DB_cloud, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((con) => {
      console.log("Db connected");
    });
}
