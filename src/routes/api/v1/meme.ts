import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';

const router = express.Router();

router.post('/', async (req, res) => {
    const {url = '', bottom = '', top = '', name = uuidv4()} = req.body;

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const image = await Jimp.read(url);
    image.print(font, 10, 10, top);
    image.print(font, 100, 100, bottom);

    const fileName = uuidv4() + '.' + image.getExtension();
    const fileUrl = 'http://localhost:8000/uploads/memes/' + fileName;

    await image.writeAsync('./uploads/memes/' + fileName);

    res.json({
        status: true,
        message: 'meme created',
        data: {
            url: fileUrl,
            name,
        }
    });
});

export default router;
