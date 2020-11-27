import express from 'express';
import User from '../../models/user';
import { v4 as uuidv4 } from 'uuid';
import Template from '../../models/template';

const router = express.Router();

router.get('/', (req, res) => res.json({status: 'ok'}));

router.put('/user', (req, res) => {
    const user = new User({
        name: 'testuser123',
        password: '123'
    });

    user.save((err) => {
        if (err) {
            console.log(err)

            res.json({err})
        } else {
            res.json({status: 'success'});
        }
    })
});

router.post('/template', (req, res) => {
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

export default router;
