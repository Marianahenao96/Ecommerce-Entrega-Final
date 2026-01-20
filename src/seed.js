import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import ProductModel from './models/Product.js';

dotenv.config();

/**
 * Datos de productos para poblar la base de datos
 */
const products = [
  { 
    title: 'Alimento Premium para Perros', 
    description: 'Alimento balanceado para perros adultos, 15kg', 
    code: 'ALIM001', 
    price: 85000, 
    stock: 25, 
    category: 'alimentos', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Alimento Premium para Gatos', 
    description: 'Alimento balanceado para gatos adultos, 7kg', 
    code: 'ALIM002', 
    price: 65000, 
    stock: 20, 
    category: 'alimentos', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Pelota Interactiva para Perros', 
    description: 'Pelota resistente con sonido para entretenimiento', 
    code: 'JUGU001', 
    price: 15000, 
    stock: 30, 
    category: 'juguetes', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Rascador para Gatos', 
    description: 'Rascador de cartón con catnip incluido', 
    code: 'JUGU002', 
    price: 25000, 
    stock: 15, 
    category: 'juguetes', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Collar Ajustable con Placa', 
    description: 'Collar de nylon resistente con placa de identificación', 
    code: 'ACCE001', 
    price: 12000, 
    stock: 40, 
    category: 'accesorios', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Correa Retráctil 5m', 
    description: 'Correa retráctil de 5 metros para perros medianos y grandes', 
    code: 'ACCE002', 
    price: 35000, 
    stock: 18, 
    category: 'accesorios', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Shampoo Antipulgas', 
    description: 'Shampoo para perros y gatos con protección antipulgas', 
    code: 'HIGI001', 
    price: 18000, 
    stock: 22, 
    category: 'higiene', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Cama Ortopédica para Perros', 
    description: 'Cama ortopédica tamaño mediano, fácil de lavar', 
    code: 'CAMA001', 
    price: 75000, 
    stock: 12, 
    category: 'cama-descanso', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Transportadora para Gatos', 
    description: 'Transportadora plástica con puerta frontal, tamaño mediano', 
    code: 'TRAN001', 
    price: 45000, 
    stock: 14, 
    category: 'transporte', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  },
  { 
    title: 'Sweater para Perros', 
    description: 'Sweater abrigado para perros pequeños y medianos', 
    code: 'ROPA001', 
    price: 28000, 
    stock: 20, 
    category: 'ropa', 
    thumbnails: ['https://www.leafio.ai/storage/common/attaches/82d5f8237b45ab2a4b947abe9a8b094420395049.webp'] 
  }
];

/**
 * Función para poblar la base de datos con productos de ejemplo
 * Elimina todos los productos existentes y crea nuevos
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed de productos...');
    
    // Usar la configuración centralizada de la base de datos
    await connectDB();
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar productos existentes
    const deleted = await ProductModel.deleteMany({});
    console.log(`🗑️  Productos eliminados: ${deleted.deletedCount}`);
    
    // Insertar nuevos productos
    const created = await ProductModel.insertMany(products);
    console.log(`✅ Seed completado: ${created.length} productos creados`);
    
    // Mostrar resumen por categoría
    const categories = {};
    created.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    console.log('\n📊 Resumen por categoría:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} productos`);
    });
    
    // Desconectar limpiamente
    await disconnectDB();
    console.log('👋 Desconectado de MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    if (err.stack) {
      console.error('Stack trace:', err.stack);
    }
    
    // Intentar desconectar en caso de error
    try {
      await disconnectDB();
    } catch (disconnectErr) {
      console.error('Error al desconectar:', disconnectErr.message);
    }
    
    process.exit(1);
  }
}

// Ejecutar seed
seed();