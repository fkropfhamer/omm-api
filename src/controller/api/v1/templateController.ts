import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Template from '../../../models/template';
import { resolve } from 'path';
import puppeteer from 'puppeteer';

async function post(req: Request, res: Response) {
    try {
        if (req.body.url) {
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                const id = uuidv4()

                const filename = id + '.jpeg';

                await page.goto(req.body.url);
                await page.screenshot({
                    path: './uploads/templates/' + filename
                });
                await browser.close();

                const url = 'http://localhost:8000/api/v1/template/image/' + id;
                const name = 'unnamed';
                const mimetype = 'jpeg';
                const size = 'unknown';

                const template = new Template({
                    id,
                    url,
                    name,
                    mimetype,
                    size,
                    views: 0,
                    filename,
                })

                await template.save();

                //send response
                res.send({
                    status: true,
                    message: 'Screenshot is uploaded',
                    data: {
                        id,
                        url,
                        name,
                        mimetype,
                        size
                    }
                });
            })()
        }
        else if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let templateFile = req.files.template;

            const id = uuidv4()

            const filename = id + '.' + templateFile.mimetype.split('/')[1];

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            templateFile.mv('./uploads/templates/' + filename);

            const url = 'http://localhost:8000/api/v1/template/image/' + id;
            const name = templateFile.name;
            const mimetype = templateFile.mimetype;
            const size = templateFile.size;

            const template = new Template({
                id,
                url,
                name,
                mimetype,
                size,
                views: 0,
                filename,
            })

            await template.save();

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    id,
                    url,
                    name,
                    mimetype,
                    size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function get(req: Request, res: Response) {
    try {
        if (req.query.id && typeof req.query.id === 'string') {
            const template = await Template.findOne({ id: req.query.id }).exec();
            if (template) {
                res.json({
                    status: true,
                    data: {
                        template
                    }
                });
            } else {
                res.json({
                    status: true,
                    message: 'template not found',
                })
            }
        } else {
            Template.find({}, (err, templates) => {
                if (err) {
                    res.send({
                        status: false,
                        message: err
                    });
                } else {
                    res.json({
                        status: true,
                        data: {
                            templates
                        }
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function image(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const template = await Template.findOne({ id }).exec() as any;

        if (template) {
            template.views += 1

            template.save();

            res.sendFile(resolve(`./uploads/templates/${template.filename}`));


        } else {
            res.json({
                status: true,
                message: 'image not found :(',
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    post,
    get,
    image,
}
