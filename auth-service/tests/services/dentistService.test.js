const DentistService = require('../../src/services/dentistService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('crypto', () => ({ randomBytes: jest.fn() }));

const db      = require('../../src/services/database');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');

describe('DentistService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createDentist', () => {
    const baseData = {
      nombre: 'Laura',
      apellidos: 'García',
      email: 'laura@clinic.com',
      telefono: '5559876543',
      cedula_profesional: '1234567',
      carrera: 'Odontología'
    };

    it('crea dentista cuando todo es válido (estado Activo)', async () => {
      db.query
        .mockResolvedValueOnce({})             
        .mockResolvedValueOnce([])              
        .mockResolvedValueOnce([{ rol_id: 2 }]) 
        .mockResolvedValueOnce({ insertId: 55 }) 
        .mockResolvedValueOnce({});              

      crypto.randomBytes.mockReturnValue(Buffer.from('123456789'));
      const pwdB64 = Buffer.from('123456789').toString('base64');
      bcrypt.hash.mockResolvedValue('hashedPass');

      const res = await DentistService.createDentist(baseData, 3);

      expect(res).toEqual({ usuario_id: 55 });
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
        DentistService.createDentist(baseData, 3)
      ).rejects.toThrow('El correo ya está registrado');

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('deleteDentist (soft delete)', () => {
    it('marca estado = Baja cuando pertenece al consultorio', async () => {
      db.query
        .mockResolvedValueOnce([{}])                 
        .mockResolvedValueOnce({ affectedRows: 1 }); 

      const res = await DentistService.deleteDentist(42, 3);

      expect(res).toEqual({ usuario_id: 42 });
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("UPDATE usuario SET estado = 'Baja'"),
        [42]
      );
    });

    it('lanza error si no pertenece al consultorio', async () => {
      db.query.mockResolvedValueOnce([]); 
      await expect(
        DentistService.deleteDentist(99, 3)
      ).rejects.toThrow('Dentista no encontrado en este consultorio');
    });
  });
});
