const CitaService = require('../../src/services/citaService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('CitaService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll llama marcarNoAsistidas y devuelve citas', async () => {
    const rows = [{ cita_id: 1, fecha: '2025-01-01', hora: '10:00', estado: 'Agendada' }];
    db.query
      .mockResolvedValueOnce({ affectedRows: 3 }) 
      .mockResolvedValueOnce(rows);              

    const res = await CitaService.getAll();

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('UPDATE cita')
    );
    expect(db.query).toHaveBeenNthCalledWith(2, 'SELECT * FROM cita');
    expect(res).toEqual(rows);
  });

  it('create inserta y devuelve la cita nueva', async () => {
    const data = {
      paciente_id: 5,
      dentista_id: 2,
      fecha: '2025-01-10',
      hora:  '09:30',
      estado: 'Agendada',
      motivo: null
    };
    db.query.mockResolvedValueOnce({ insertId: 20 });

    const res = await CitaService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO cita (paciente_id, dentista_id, fecha, hora, estado, motivo) VALUES (?, ?, ?, ?, ?, ?)',
      [5, 2, '2025-01-10', '09:30', 'Agendada', null]
    );
    expect(res).toEqual({ cita_id: 20, ...data });
  });

  it('update devuelve objeto actualizado cuando afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const data = { fecha: '2025-02-01', hora: '11:00', estado: 'Reprogramada', motivo: 'Cambio paciente' };
    const res = await CitaService.update(7, data);

    expect(res).toEqual({ cita_id: 7, ...data });
  });

  it('update devuelve null cuando id inexistente', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });

    const res = await CitaService.update(99, { fecha: 'x', hora: 'x', estado: 'x', motivo: null });
    expect(res).toBeNull();
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await CitaService.delete(3);
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await CitaService.delete(123);
    expect(res).toBe(false);
  });

  it('getCitaConUsuarios devuelve cita con datos de usuarios', async () => {
    const row = {
      cita_id: 4,
      fecha: '2025-03-01',
      hora:  '08:00',
      estado:'Agendada',
      motivo:null,
      paciente_id: 1,
      paciente_nombre: 'Juan',
      dentista_id: 2,
      dentista_nombre:'Laura'
    };

    db.query
      .mockResolvedValueOnce({ affectedRows: 0 }) 
      .mockResolvedValueOnce([row]);            

    const res = await CitaService.getCitaConUsuarios(4);

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('JOIN auth_db.usuario p'),
      [4]
    );
    expect(res).toEqual(row);
  });
});