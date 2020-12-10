import jwt from 'jsonwebtoken';
import { Request, Response } from "express"

export async function authenticated(req: Request, res: Response, next: any) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, 'fdadfafadsvcdafg', (err: any, user: any) => {
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
