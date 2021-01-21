import {Request, Response} from 'express';
import User from '../../../models/user';
import bcrypt from 'bcrypt';
import { generateJWT } from '../../../authenticaton';

async function put(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: passwordHash,
        });
    
        await user.save();

        res.json({
            status: true,
            message: 'user created',
        });
    } catch(err) {
        res.status(500).send(err);
        console.log(err);
    }   
}

async function authenticate(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({username}).exec() as any;

        console.log(user);

        if (user) {
            if (await bcrypt.compare(password, user.password)) {

                const token = generateJWT({ sub: user._id });

                res.json({
                    status: true,
                    message: 'right',
                    token
                });
            } else {
                res.json({
                    status: false,
                    message: 'wrong password',
                });
            }
        } else {
            res.json({
                status: false,
                message: 'not found',
            });
        }

        
    } catch(err) {
        res.status(500).send(err);
        console.log(err);
    }   
}

async function me(req: Request, res: Response) {
    try {
        const user = await User.findById(res.locals.user.sub) as any;

        if (user) {
            const data = {
                id: user._id,
                username: user.username
            }

            res.json({
                status: true,
                data
            })
        } else {
            res.json({
                status: false,
                message: "user not found",
            });
        }
    } catch(err) {
        res.status(500).send(err);
        console.log(err);
    }
}

export default {
    put,
    authenticate,
    me,
}
