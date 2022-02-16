import { get } from "lodash"; // allows to safely access property that might not exist
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

/**
 * Will allow to get hands on the actual user sending the request
 * |READ| - what is a 'next' function? PURPOSE?
 * @param req 
 * @param res 
 * @param next 
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );

    const refreshToken = get(req, "headers.x-refresh"); // referesh token always sits in headers
    
    if (!accessToken) {
        return next();
    }

    /**
     * |READ| - in what part of the JWT token there is a user encoded??
     */
    // we will have `decoded` value when accessToken was valid
    const { decoded, expired } = verifyJWT(accessToken);

    // attach the user to res.locals.user so it is accessible for further called functions (especially route handlers)
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    // if access token is expired and there is a refresh token
    // then reIssue a new access token - |READ| - what is the purpose of so short TTL of access token?
    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken(refreshToken);
        
        if (newAccessToken) {
            // set a header with that new access token
            res.setHeader('x-access-token', newAccessToken);
        }

        const result = verifyJWT(newAccessToken as string);

        res.locals.user = result.decoded;
        return next();
    }

    return next();
}

export default deserializeUser;