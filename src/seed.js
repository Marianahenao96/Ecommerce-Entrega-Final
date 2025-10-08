import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import ProductModel from './models/Product.js';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
const products = [
  { title: 'Camiseta Básica', description: '100% algodón', code: 'CAMI001', price: 45000, stock: 25, category: 'Ropa', thumbnails: ['https://png.pngtree.com/background/20230625/original/pngtree-e-commerce-and-technology-merge-3d-render-of-online-shopping-with-picture-image_4040237.jpg'] },
  { title: 'Pantalón Jeans', description: 'Jeans clásico', code: 'JEAN001', price: 95000, stock: 15, category: 'Ropa', thumbnails: ['https://png.pngtree.com/background/20230625/original/pngtree-e-commerce-and-technology-merge-3d-render-of-online-shopping-with-picture-image_4040237.jpg'] },
  { title: 'Zapatillas Deportivas', description: 'Zapatillas para correr', code: 'ZAPA001', price: 150000, stock: 10, category: 'Calzado', thumbnails: ['https://png.pngtree.com/background/20230625/original/pngtree-e-commerce-and-technology-merge-3d-render-of-online-shopping-with-picture-image_4040237.jpg'] },
  { title: 'Gorra Casual', description: 'Gorra ajustable', code: 'GORR001', price: 30000, stock: 30, category: 'Accesorios', thumbnails: ['https://png.pngtree.com/background/20230625/original/pngtree-e-commerce-and-technology-merge-3d-render-of-online-shopping-with-picture-image_4040237.jpg'] },
  { title: 'Reloj Inteligente', description: 'Smartwatch con GPS', code: 'RELO001', price: 250000, stock: 12, category: 'Tecnologia', thumbnails: ['https://png.pngtree.com/background/20230625/original/pngtree-e-commerce-and-technology-merge-3d-render-of-online-shopping-with-picture-image_4040237.jpg'] }
];
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a Mongo para seed');
    await ProductModel.deleteMany({});
    const created = await ProductModel.insertMany(products);
    console.log('Seed completado:', created.length, 'productos creados');
    process.exit(0);
  } catch (err) {
    console.error('Error seed:', err);
    process.exit(1);
  }
}
seed();