const FotoService = require('../../src/services/fotoProcedimientoService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('FotoProcedimientoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de fotos', async () => {
    const rows = [{ foto_id: 1, cita_id: 5, ruta_imagen: '/img/1.png' }];
    db.query.mockResolvedValueOnce(rows);

    const res = await FotoService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM foto_procedimiento');
    expect(res).toEqual(rows);
  });

  it('getById devuelve la foto solicitada', async () => {
    const row = { foto_id: 2, cita_id: 6, ruta_imagen: '/img/2.png' };
    db.query.mockResolvedValueOnce([row]);

    const res = await FotoService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM foto_procedimiento WHERE foto_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve la foto nueva con fecha', async () => {
    const data = { cita_id: 7, ruta_imagen: '/img/3.png' };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const before = Date.now();
    const res = await FotoService.create(data);
    const after  = Date.now();

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO foto_procedimiento'),
      [7, '/img/3.png']
    );
    expect(res).toMatchObject({ foto_id: 10, ...data });
    expect(res.fecha.getTime()).toBeGreaterThanOrEqual(before - 50);
    expect(res.fecha.getTime()).toBeLessThanOrEqual(after + 50);
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await FotoService.delete(8);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM foto_procedimiento WHERE foto_id = ?',
      [8]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await FotoService.delete(99);
    expect(res).toBe(false);
  });
});