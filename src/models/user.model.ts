import mongoose from "mongoose";
import bcrypt from "bcrypt"; // used to hash users password
import config from "config";

/**
 * Interface definition for the userSchema
 */
export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>
}

/**
 * Schema definition
 * |READ| - what is schema
 */
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    }, 
    {
        timestamps: true, // gives created and updated dates automatically
    },
);

/**
 * |POTENTIAL MISTAKE|
 * PRE SAVE HOOK FOR HASHING THE USER"S PASSWORD
 * |READ| - when pre is called; what is next function
 * |READ| - salt and hasing in bcrypt
 * We are not using an arrow function because of `this` context
 */
userSchema.pre('save', async function (next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
});

/**
 * Returns true when candidatePassword matches the user password
 * Returns false otherwise
 * We are not using an arrow function because of `this` context
 * @param candidatePassword - provided password
 * Each user document will have access to this method!
 */
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;
    // compare candidate password with the actual one
    return bcrypt.compare(candidatePassword, user.password)
        .catch(e => false);
}

/**
 * Model definition
 * |READ| - what is model
 * Model will be used for creating new user documents based on userSchema!
 */
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;


