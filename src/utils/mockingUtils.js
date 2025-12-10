import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

// Generar usuarios mockeados
export const generateMockUsers = (quantity) => {
  const users = [];
  
  for (let i = 0; i < quantity; i++) {
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      age: faker.number.int({ min: 18, max: 80 }),
      password: bcrypt.hashSync('coder123', 10), // Contraseña encriptada
      role: faker.helpers.arrayElement(['user', 'admin']), // Role aleatorio entre user y admin
      pets: [] // Array vacío como se especifica
    };
    
    users.push(user);
  }
  
  return users;
};

// Generar pets mockeados
export const generateMockPets = (quantity) => {
  const pets = [];
  const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
  const petNames = {
    dog: ['Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Milo', 'Sadie'],
    cat: ['Whiskers', 'Shadow', 'Mittens', 'Tiger', 'Smokey', 'Felix', 'Luna', 'Oliver'],
    bird: ['Tweety', 'Polly', 'Rio', 'Kiwi', 'Sunny', 'Angel', 'Pepper', 'Charlie'],
    rabbit: ['Bunny', 'Cocoa', 'Oreo', 'Snowball', 'Thumper', 'Pepper', 'Honey', 'Marshmallow'],
    hamster: ['Nibbles', 'Pip', 'Cheeks', 'Hammy', 'Peanut', 'Cocoa', 'Tiny', 'Gizmo']
  };
  
  for (let i = 0; i < quantity; i++) {
    const specie = faker.helpers.arrayElement(species);
    const names = petNames[specie] || ['Pet'];
    
    const pet = {
      name: faker.helpers.arrayElement(names),
      specie: specie,
      birthDate: faker.date.past({ years: 15 })
    };
    
    pets.push(pet);
  }
  
  return pets;
};

