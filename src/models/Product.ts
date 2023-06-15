import mongoose, { Schema, Document } from 'mongoose';

interface Product extends Document {
    name: string;
    description: string;
    price: number;
    productCategory: string[];
    thumbnails: string[];
    owner: Schema.Types.ObjectId;
}

const productSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    productCategory: [{ type: String }],
    thumbnails: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const ProductModel = mongoose.model<Product>('Product', productSchema);

export default ProductModel;