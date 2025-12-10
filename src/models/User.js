import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  age: {
    type: Number,
    required: true,
    min: [0, 'La edad debe ser un número positivo']
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  pets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Pet',
    default: []
  }
}, {
  timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada o es nueva
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Encriptar la contraseña usando bcrypt.hashSync
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

