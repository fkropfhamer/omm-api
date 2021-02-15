import { v4 as uuidv4 } from "uuid";
import Jimp from "jimp";
import { Request, Response } from "express";
import Meme from "../../../models/meme";
import apiFeatures from "../../../utils/APIFeatures";
import { resolve } from "path";

async function post(req: Request, res: Response) {
  try {
    const { url = "", bottom = "", top = "" } = req.body;
    let { name } = req.body;

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const image = await Jimp.read(url);
    image.print(font, 10, 10, top);
    image.print(font, 100, 100, bottom);

    const id = uuidv4();

    if (!name) {
      name = id;
    }

    const filename = id + "." + image.getExtension();
    const fileUrl = "http://localhost:8000/api/v1/meme/image/" + id;

    await image.writeAsync("./uploads/memes/" + filename);

    const meme = new Meme({
      id,
      url: fileUrl,
      name,
      views: 0,
      filename,
    });

    await meme.save();

    res.json({
      status: true,
      message: "meme created",
      data: {
        id,
        url: fileUrl,
        name,
      },
    });
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}
async function get(req: Request, res: Response) {
  try {
    if (req.query.id && typeof req.query.id === "string") {
      const meme = await Meme.findOne({ id: req.query.id }).exec();
      if (meme) {
        res.json({
          status: true,
          data: {
            meme,
          },
        });
      } else {
        res.send({
          status: false,
          message: "meme not found",
        });
      }
    } else {
      const memes = await Meme.find({}).exec();
      res.json({
        status: true,
        data: {
          memes,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}
async function getAll(req: Request, res: Response) {
  try {
    const features = new apiFeatures(
      //query middleware is excuted here
      Meme.find(),
      req.query
    )
      .filter()
      .sort()
      .select()
      .paginate();
    const memes = await features.query_db;

    res.json({
      status: true,
      data: {
        memes,
      },
    });
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}
async function getOne(req: Request, res: Response) {
  try {
    console.log(req.params.id);
    const meme = await Meme.findOne({ name: req.params.name });
    console.log(meme);

    if (meme) {
      res.json({
        status: true,
        data: {
          meme,
        },
      });
    } else {
      res.send({
        status: false,
        message: "meme not found",
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}
async function getSome(req: Request, res: Response, next: Function) {
  //Tag/
  //regular expression
  try {
    console.log(req.body);

    if (req.body.tags === []) {
      next();
    }
    //make a deep copy

    const { tags, fileformat } = req.body;
    const memes = await Meme.find({ tags: tags, fileformat: fileformat });
    console.log(memes);

    if (memes) {
      res.json({
        status: true,
        data: {
          memes,
        },
      });
    } else {
      res.send({
        status: false,
        message: "memes with these formats/tags not found",
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}
async function getStats(req: Request, res: Response) {
  const { views, votes } = req.body;
  const numVotes = votes.length;
  const stats = await Meme.aggregate([
    {
      $match: {},
    },

    {
      $group: {},
    },
    {
      $sort: { votes: -1, views: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
}
async function image(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const meme = (await Meme.findOne({ id }).exec()) as any;

    if (meme) {
      meme.views += 1;

      meme.save();

      res.sendFile(resolve(`./uploads/memes/${meme.filename}`));
    } else {
      res.json({
        status: true,
        message: "image not found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export default {
  post,
  get,
  getAll,
  getStats,
  getSome,
  getOne,
  image,
};
