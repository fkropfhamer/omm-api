import express from "express";
import cors from "cors";
import * as apiV1 from "./routes/api/v1/apiV1Router";
import fileUpload from "express-fileupload";
const hpp = require("hpp");

const app = express();

app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.json());

//app.use('/uploads', express.static('uploads'));

//http parameter polution prevention
//app.use(hpp({ whitelist: [some allowed keys as stringshere...],}));

app.use("/status", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1", apiV1.default);

export default app;
