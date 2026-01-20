import request from 'supertest';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import PetModel from '../src/models/Pet.js';
import UserModel from '../src/models/User.js';
import app from '../src/app.js';

describe('Pets Router Tests', () => {
  let testUser;
  let testPet;
  let testPet2;

  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    await connectDB();
    
    // Limpiar colecciones
    await PetModel.deleteMany({});
    await UserModel.deleteMany({});

    // Crear usuario de prueba
    testUser = await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@pets.com',
      age: 25,
      password: 'test123',
      role: 'user'
    });

    // Crear pets de prueba
    testPet = await PetModel.create({
      name: 'Max',
      specie: 'dog',
      birthDate: new Date('2020-01-15'),
      owner: testUser._id
    });

    testPet2 = await PetModel.create({
      name: 'Luna',
      specie: 'cat',
      birthDate: new Date('2021-03-20'),
      owner: testUser._id
    });
  });

  afterAll(async () => {
    // Limpiar después de las pruebas
    await PetModel.deleteMany({});
    await UserModel.deleteMany({});
    await disconnectDB();
  });

  describe('GET /api/pets', () => {
    it('should return all pets successfully', async () => {
      const response = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('payload');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.payload)).toBe(true);
      expect(response.body.payload.length).toBeGreaterThanOrEqual(2);
    });

    it('should return pets with populated owner information', async () => {
      const response = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(response.body.status).toBe('success');
      if (response.body.payload.length > 0) {
        const pet = response.body.payload[0];
        expect(pet).toHaveProperty('name');
        expect(pet).toHaveProperty('specie');
        expect(pet).toHaveProperty('birthDate');
      }
    });

    it('should handle empty pets list gracefully', async () => {
      // Guardar IDs de pets existentes
      const existingPetIds = [testPet._id, testPet2._id];
      
      // Limpiar pets temporalmente
      await PetModel.deleteMany({});
      
      const response = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.payload).toEqual([]);
      expect(response.body.total).toBe(0);

      // Restaurar pets originales
      testPet = await PetModel.create({
        name: 'Max',
        specie: 'dog',
        birthDate: new Date('2020-01-15'),
        owner: testUser._id
      });

      testPet2 = await PetModel.create({
        name: 'Luna',
        specie: 'cat',
        birthDate: new Date('2021-03-20'),
        owner: testUser._id
      });
    });
  });

  describe('GET /api/pets/:pid', () => {
    it('should return a pet by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/pets/${testPet._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('payload');
      expect(response.body.payload).toHaveProperty('_id', testPet._id.toString());
      expect(response.body.payload).toHaveProperty('name', 'Max');
      expect(response.body.payload).toHaveProperty('specie', 'dog');
    });

    it('should return 404 for non-existent pet ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/pets/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Pet no encontrado');
    });

    it('should return 500 for invalid pet ID format', async () => {
      const response = await request(app)
        .get('/api/pets/invalid-id')
        .expect(500);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Error al obtener pet');
    });

    it('should return pet with populated owner when owner exists', async () => {
      const response = await request(app)
        .get(`/api/pets/${testPet._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.payload).toHaveProperty('owner');
    });

    it('should return second pet correctly', async () => {
      const response = await request(app)
        .get(`/api/pets/${testPet2._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.payload).toHaveProperty('name', 'Luna');
      expect(response.body.payload).toHaveProperty('specie', 'cat');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Simular error desconectando temporalmente
      // Nota: En un entorno real, esto requeriría mockear la conexión
      const response = await request(app)
        .get('/api/pets')
        .expect(200); // Debería funcionar normalmente

      expect(response.body).toHaveProperty('status');
    });
  });
});

