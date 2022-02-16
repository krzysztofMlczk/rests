import { Request, Response, NextFunction } from "express";

/**
 * Middleware allowing to check wether the request was made by an authorized user
 * (user that could be decoded from a valid JWT - see deserializeUser.ts)
 * It will be applied to all routes that require the user to be logged in!
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
        return res.sendStatus(403);
    }

    return next();
}

export default requireUser;