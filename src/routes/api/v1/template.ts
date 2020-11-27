import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Template from '../../../models/template';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let templateFile = req.files.template;

            const id = uuidv4() + '.' + templateFile.mimetype.split('/')[1];
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            templateFile.mv('./uploads/templates/' + id);
            
            const url = 'http://localhost:8000/uploads/templates/' + id;
            const name = templateFile.name;
            const mimetype = templateFile.mimetype;
            const size = templateFile.size;

            const template = new Template({
                url,
                name,
                mimetype,
                size,
            })
            
            template.save();

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
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
});

router.get('/', (req, res) => {
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
});

export default router;
