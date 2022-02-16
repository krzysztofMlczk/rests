import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { verifyJWT, signJWT } from "../utils/jwt.utils";
import { findUser } from "./user.service";

/**
 * |READ| - what is a model in mongoose?
 * Is it an aboject representing a whole collection of documents? (A single table?)
 * @param userId 
 * @param userAgent 
 * @returns 
 */
export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });

    return session.toJSON();
}

/**
 * |READ| - what is a generic in TypeScript???
 * @param query
 */
export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean(); // lean allows ot skip functions of the object - we get just a plain object
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken(refreshToken: string) {
    // make sure the refreshToken is valid (by trying to decode it)
    const { decoded } = verifyJWT(refreshToken);
    
    // `session` on the decoded refresh token is an id of a session - see session controller (how the tokens are created)
    // we need the session id to make sure the session is valid before we issue an access token
    
    if (!decoded || !get(decoded, 'session')) return false;

    const session = await SessionModel.findById(get(decoded, 'session'));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    // create a new accessToken
    const accessToken = signJWT({ // this object will be encoded in the token
        ...user,
        session: session._id,
    },
    { expiresIn: config.get('accessTokenTtl') }, // 15 minutes
    );

    return accessToken;
}