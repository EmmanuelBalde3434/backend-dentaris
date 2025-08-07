const HistorialService = require('../../src/services/historialService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('HistorialService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de historiales', async () => {
    const rows = [{ historial_id: 1, usuario_id: 5, detalles: 'Ok' }];
    db.query.mockResolvedValueOnce(rows);

    const res = await HistorialService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM historial_clinico');
    expect(res).toEqual(rows);
  });

  it('getById devuelve un historial', async () => {
    const row = { historial_id: 2, usuario_id: 6, detalles: 'Alérgico' };
    db.query.mockResolvedValueOnce([row]);

    const res = await HistorialService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM historial_clinico WHERE historial_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve el historial con fecha_creacion', async () => {
    const data = { usuario_id: 7, detalles: 'Antecedentes...' };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const before = Date.now();
    const res = await HistorialService.create(data);
    const after  = Date.now();

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO historial_clinico (usuario_id, detalles) VALUES (?, ?)',
      [7, 'Antecedentes...']
    );
    expect(res).toMatchObject({ historial_id: 10, ...data });
    expect(res.fecha_creacion.getTime()).toBeGreaterThanOrEqual(before - 50);
    expect(res.fecha_creacion.getTime()).toBeLessThanOrEqual(after + 50);
  });

  it('update devuelve objeto cuando afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await HistorialService.update(4, { detalles: 'Actualizado' });

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE historial_clinico SET detalles = ? WHERE historial_id = ?',
      ['Actualizado', 4]
    );
    expect(res).toEqual({ historial_id: 4, detalles: 'Actualizado' });
  });

  it('update devuelve null si el id no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await HistorialService.update(99, { detalles: 'x' });
    expect(res).toBeNull();
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await HistorialService.delete(8);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM historial_clinico WHERE historial_id = ?',
      [8]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await HistorialService.delete(123);
    expect(res).toBe(false);
  });
});