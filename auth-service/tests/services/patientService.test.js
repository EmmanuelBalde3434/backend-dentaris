const PatientService = require('../../src/services/patientService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('crypto', () => ({ randomBytes: jest.fn() }));

const db      = require('../../src/services/database');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');

describe('PatientService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createPatient', () => {
    const data = {
      rol: 'Paciente',
      nombre: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      telefono: '5551234567',
      fecha_nacimiento: '1990-05-21',
      genero: 'M'
    };

    it('crea paciente cuando todo es válido (estado Activo explícito)', async () => {
      db.query
        .mockResolvedValueOnce({})              
        .mockResolvedValueOnce([])              
        .mockResolvedValueOnce([{ rol_id: 3 }])  
        .mockResolvedValueOnce({ insertId: 77 })
        .mockResolvedValueOnce({});              

      crypto.randomBytes.mockReturnValue(Buffer.from('abcdefghi'));
      const pwdB64 = Buffer.from('abcdefghi').toString('base64');
      bcrypt.hash.mockResolvedValue('hashedPass');

      const res = await PatientService.createPatient(data, 4);

      expect(res).toEqual({ usuario_id: 77 });
      expect(bcrypt.hash).toHaveBeenCalledWith(pwdB64, 10);

      const insertCall = db.query.mock.calls[3];
      expect(insertCall[0]).toContain('INSERT INTO usuario');
      const params = insertCall[1];
      expect(params[params.length - 1]).toBe('Activo');
    });

    it('lanza error si el correo ya existe', async () => {
      db.query
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce([{}]); 

      await expect(
        PatientService.createPatient(data, 4)
      ).rejects.toThrow('El correo ya está registrado');
    });
  });

  describe('updatePatient', () => {
    it('lanza error si no hay campos permitidos', async () => {
      db.query.mockResolvedValueOnce([{}]);

      await expect(
        PatientService.updatePatient(77, { campoInvalido: 'x' }, 4)
      ).rejects.toThrow('Sin campos para actualizar');
    });
  });

  describe('deletePatient (soft delete)', () => {
    it('marca estado = Baja cuando el paciente pertenece al consultorio', async () => {
      db.query
        .mockResolvedValueOnce([{}])                 
        .mockResolvedValueOnce({ affectedRows: 1 });

      const res = await PatientService.deletePatient(99, 4);

      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("UPDATE usuario SET estado = 'Baja'"),
        [99]
      );
      expect(res).toEqual({ usuario_id: 99 });
    });

    it('falla cuando el paciente no pertenece al consultorio', async () => {
      db.query.mockResolvedValueOnce([]);
      await expect(
        PatientService.deletePatient(99, 4)
      ).rejects.toThrow('Paciente no encontrado en este consultorio');
    });
  });
});
