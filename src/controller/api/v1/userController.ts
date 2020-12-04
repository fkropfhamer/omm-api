import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../../../models/user';

function put(req: express.Request, res: express.Response) {
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
}

export default {
    put
}
