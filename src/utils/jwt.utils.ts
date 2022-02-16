import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

/**
 * |READ| - what signing a JWT means?
 */
export function signJWT(
    object: Object,
    options?: jwt.SignOptions | undefined
) {
    return jwt.sign(object, privateKey, {
        ...(options && options), // sanity check so that we do not spread the undefined type
        algorithm: 'RS256',
    })
}

/**
 * |READ| - verifying a JWT token? - what it means?
 * @param token 
 */
export function verifyJWT(token: string) {
    
    try {
        const decoded = jwt.verify(token, publicKey);
        
        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch(e: any) {
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null,
        };
    }

}