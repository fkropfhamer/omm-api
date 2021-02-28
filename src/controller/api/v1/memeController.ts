import { v4 as uuidv4 } from "uuid";
import Jimp from "jimp";
import { Request, Response } from "express";
import Meme from "../../../models/meme";
import { resolve } from "path";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import AdmZip from 'adm-zip';

async function postMultiple(req: Request, res: Response) {
  try {
    const { urls = [], texts = [], isPrivate } = req.body;
    console.log(req.body);
    let { name } = req.body;
    

    const zip = new AdmZip();
    const images: any[] = [];

    urls.forEach(async (url: any) => {
      texts.forEach(async (text: any) => {
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        const image = await loadImage(url);
        ctx.drawImage(image, 0, 0, 500, 500);

        ctx.textAlign = "center";

        text.forEach((t: any) => {
          ctx.font = t.size + "px Comic Sans MS" + t.isBold + t.isItalic;
          ctx.fillStyle = t.hexColor;
          ctx.fillText(t.text, t.x, t.y);
        });

        const id = uuidv4();

        if (!name) {
          name = id;
        }

        const filename = id + ".jpeg";
        const fileUrl = "http://localhost:8000/api/v1/meme/image/" + id;

        const out = fs.createWriteStream("./uploads/memes/" + filename);
        const stream = canvas.createJPEGStream();
        stream.pipe(out);
        out.on("finish", async () => {
          console.log("The JPEG file was created.");

          zip.addLocalFile("./uploads/memes/" + filename);

          const meme = new Meme({
            id,
            url: fileUrl,
            name,
            views: 0,
            filename,
            createdAt: Date.now(),
            secretMeme: isPrivate,
          });

          await meme.save();

          images.push({ id, url: fileUrl, name });
          if (images.length === urls.length * texts.length) {
            res.type('zip')
            res.send(zip.toBuffer())
            res.json({
              status: true,
              message: "memes created",
              data: {
                images,
              },
            });
          }
        });
      });
    });
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

async function post(req: Request, res: Response) {
  try {
    const { url = "", texts = [], isPrivate } = req.body;
    console.log(req.body);
    let { name } = req.body;

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");
    const image = await loadImage(url);
    ctx.drawImage(image, 0, 0, 500, 500);

    ctx.textAlign = "center";

    texts.forEach((text: any) => {
      ctx.font = text.size + "px Comic Sans MS" + text.isBold + text.isItalic;
      ctx.fillStyle = text.hexColor;
      ctx.fillText(text.text, text.x, text.y);
    });

    const id = uuidv4();

    if (!name) {
      name = id;
    }

    const filename = id + ".jpeg";
    const fileUrl = "http://localhost:8000/api/v1/meme/image/" + id;

    const out = fs.createWriteStream("./uploads/memes/" + filename);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on("finish", async () => {
      console.log("The JPEG file was created.");

      const meme = new Meme({
        id,
        url: fileUrl,
        name,
        views: 0,
        filename,
        createdAt: Date.now(),
        secretMeme: isPrivate,
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
    });
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

async function postSimple(req: Request, res: Response) {
  try {
    const { url = "", bottom = "", top = "", isPrivate } = req.body;
    console.log(req.body);
    let { name } = req.body;

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const image = await Jimp.read(url);
    image.print(
      font,
      0,
      10,
      {
        text: top,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP,
      },
      image.bitmap.width,
      image.bitmap.height
    );
    image.print(
      font,
      0,
      -10,
      {
        text: bottom,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
      },
      image.bitmap.width,
      image.bitmap.height
    );

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
      likes:0,
      dislikes:0,
      filename,
      createdAt: Date.now(),
      secretMeme: isPrivate,
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
      const memes = await Meme.find({ secretMeme: { $ne: true } }).exec();
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
    const memes = await Meme.find({ secretMeme: { $ne: true } }).sort(
      `-${req.params.sortBy}`
    );
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
    const meme = await Meme.findOne({
      name: req.params.name,
      secretMeme: { $ne: true },
    });
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
  const { views, votes} = req.body;
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

async function like(req: Request, res: Response) {
  try {
    const { id } = req.body;

    const meme = (await Meme.findOne({ id }).exec()) as any;

    if (meme) {
      meme.likes += 1;
      meme.save();

      res.json({
        status: true,
        message: "meme liked"
      })
    } else {
      res.json({
        status: false,
        message: "meme not found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

async function dislike(req: Request, res: Response) {
  try {
    const { id } = req.body;

    const meme = (await Meme.findOne({ id }).exec()) as any;

    if (meme) {
      meme.dislikes += 1;
      meme.save();

      res.json({
        status: true,
        message: "meme disliked"
      })
    } else {
      res.json({
        status: false,
        message: "meme not found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

async function comment(req: Request, res: Response) {
  try {
    const { id, comment } = req.body;

    const meme = (await Meme.findOne({ id }).exec()) as any;

    if (meme) {
      meme.comments.push(comment);
      meme.save();

      res.json({
        status: true,
        message: "comment saved"
      })
    } else {
      res.json({
        status: false,
        message: "meme not found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export default {
  postMultiple,
  post,
  postSimple,
  get,
  getAll,
  getStats,
  getSome,
  getOne,
  image,
  like,
  dislike,
  comment,
};
