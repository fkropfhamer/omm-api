import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express"

const secret = 'fdadfafadsvcdafg';

export function generateJWT(data: any) {
    jwt.sign(data, secret, { expiresIn: '7d' });
}

export function authenticated(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            res.locals.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
} 
