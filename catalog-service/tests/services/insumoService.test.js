const InsumoService = require('../../src/services/insumoService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('InsumoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de insumos', async () => {
    const rows = [{ insumo_id: 1, nombre: 'Guantes' }];
    db.query.mockResolvedValueOnce(rows);

    const res = await InsumoService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM insumo');
    expect(res).toEqual(rows);
  });

  it('getById devuelve un insumo existente', async () => {
    const row = { insumo_id: 2, nombre: 'Algodón' };
    db.query.mockResolvedValueOnce([row]);

    const res = await InsumoService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM insumo WHERE insumo_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('getById devuelve undefined cuando no existe', async () => {
    db.query.mockResolvedValueOnce([]);        // sin filas
    const res = await InsumoService.getById(99);
    expect(res).toBeUndefined();
  });

  it('create inserta y devuelve el insumo nuevo', async () => {
    const data = { nombre: 'Mascarilla', unidad: 'pz', costo_unitario: 5, notas: null };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const res = await InsumoService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO insumo (nombre, unidad, costo_unitario, notas) VALUES (?, ?, ?, ?)',
      [data.nombre, data.unidad, data.costo_unitario, data.notas]
    );
    expect(res).toEqual({ insumo_id: 10, ...data });
  });

  it('update devuelve objeto actualizado cuando afecta filas', async () => {
    const data = { nombre: 'Gel', unidad: 'ml', costo_unitario: 3, notas: '70%' };
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await InsumoService.update(5, data);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE insumo SET nombre = ?, unidad = ?, costo_unitario = ?, notas = ? WHERE insumo_id = ?',
      [data.nombre, data.unidad, data.costo_unitario, data.notas, 5]
    );
    expect(res).toEqual({ insumo_id: 5, ...data });
  });

  it('update devuelve null cuando no afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await InsumoService.update(99, { nombre: 'x' });
    expect(res).toBeNull();
  });

  it('delete devuelve true si se elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await InsumoService.delete(7);
    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM insumo WHERE insumo_id = ?',
      [7]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false si no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await InsumoService.delete(123);
    expect(res).toBe(false);
  });
});