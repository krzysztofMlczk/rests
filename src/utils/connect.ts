import mongoose from "mongoose";
import config from "config";
import logger from "../utils/logger";

/**
 * Function responsible for connecting to the database
 */
const connect = async () => {
    const dbUri = config.get<string>('dbUri');

    try {
        await mongoose.connect(dbUri);
        logger.info('Connected to the DB');
    } catch (error) {
        logger.error('Could not connect to the DB');
        process.exit(1); // exit with an error
    }
}

export default connect;