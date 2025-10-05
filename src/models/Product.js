import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Activar paginación
productSchema.plugin(mongoosePaginate);

// Evitar el error “Cannot overwrite model once compiled”
const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;
