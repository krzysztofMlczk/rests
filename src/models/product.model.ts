import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

/**
 * |IMPORTANT|: A Mongoose model is a wrapper on the Mongoose schema. 
 * A Mongoose schema defines the structure of the document, default values, 
 * validators, etc., whereas a Mongoose model provides an interface to the database 
 * for creating, querying, updating, deleting records, etc.
 */

// allows to create custom alphabet for nanoid
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

/**
 * Interface definition for the ProductDocument
 */
export interface ProductDocument extends mongoose.Document {
    user: UserDocument["_id"]; // user that created the product
    title: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema definition
 * |READ| - what is a schema in mongoose (DESCRIBES THE STRUCTURE OF MONGODB DOCUMENT!)
 */
const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
            default: () => `product_${nanoid()}`,
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
    }, 
    {
        timestamps: true, // gives created and updated dates automatically
    },
);


/**
 * Model definition
 * |READ| - what is a model
 * 
 */
const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;


