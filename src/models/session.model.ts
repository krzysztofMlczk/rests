import mongoose from "mongoose";
import { UserDocument } from "./user.model";

/**
 * Interface definition for the SessionDocument
 */
export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema definition
 * |READ| - what is a schema in mongoose (DESCRIBES THE STRUCTURE OF MONGODB DOCUMENT!)
 */
const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
    }, 
    {
        timestamps: true, // gives created and updated dates automatically
    },
);


/**
 * Model definition
 * |READ| - what is a model
 */
const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;


