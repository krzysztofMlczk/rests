import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput['body']>,
    res: Response
) {

    try {
        const user = await createUser(req.body); // call create user service
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
         // 409 - means conflict (throw will happen when user email was not unique)
        return res.status(409).send(e.message);
    }

}