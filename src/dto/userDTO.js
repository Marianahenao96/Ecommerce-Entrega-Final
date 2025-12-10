class UserDTO {
  constructor(user) {
    this.id = user._id || user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    // Manejar carrito: puede ser ObjectId, objeto populado, o null
    if (user.cart) {
      this.cart = typeof user.cart === 'object' && user.cart._id 
        ? user.cart._id.toString() 
        : user.cart.toString ? user.cart.toString() : user.cart;
    } else {
      this.cart = null;
    }
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  // Método estático para crear DTO desde el modelo
  static from(user) {
    if (!user) return null;
    return new UserDTO(user);
  }

  // Método para convertir a objeto plano
  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      age: this.age,
      role: this.role,
      cart: this.cart ? (typeof this.cart === 'object' && this.cart._id ? this.cart._id.toString() : this.cart.toString()) : null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default UserDTO;

