import { describe, it, expect, vi } from 'vitest';
import supertest from 'supertest';
import { buildServer } from '../../src/server'; // Asumiendo estructura Fastify

describe('QA_TC01_AUTH_Login', () => {
  it('Inicio de sesión exitoso con cookie httpOnly y JWT', async () => {
    // Configuración inicial
    const app = await buildServer();
    await app.ready();

    // Simulación de usuario válido
    // (En fase de implementación deberás usar la base de datos de tests o un mock)
    const validCredentials = {
      email: 'test@org.com',
      password: 'password123',
    };

    // Petición
    const response = await supertest(app.server)
      .post('/auth/login')
      .send(validCredentials);

    // Assertions
    expect(response.status).toBe(200);

    // Validación de galleta
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    
    // Aquí puedes añadir más asserts dependendiendo de los requerimientos exactos,
    // ej. comprobar si el JWT está en el payload devuelto como body, etc.
  });
});
