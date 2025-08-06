const TratamientoService = require('../../src/services/tratamientoService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('TratamientoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de tratamientos', async () => {
    const rows = [{ tratamiento_id: 1, nombre: 'Limpieza', precio_unitario: 500 }];
    db.query.mockResolvedValueOnce(rows);

    const res = await TratamientoService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM tratamiento');
    expect(res).toEqual(rows);
  });

  it('getById devuelve tratamiento existente', async () => {
    const row = { tratamiento_id: 2, nombre: 'Endodoncia', precio_unitario: 1500 };
    db.query.mockResolvedValueOnce([row]);

    const res = await TratamientoService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM tratamiento WHERE tratamiento_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve el tratamiento nuevo', async () => {
    const data = { nombre: 'Blanqueamiento', precio_unitario: 2000 };
    db.query.mockResolvedValueOnce({ insertId: 7 });

    const res = await TratamientoService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO tratamiento (nombre, precio_unitario) VALUES (?, ?)',
      [data.nombre, data.precio_unitario]
    );
    expect(res).toEqual({ tratamiento_id: 7, ...data });
  });

  it('update devuelve objeto actualizado si hay filas afectadas', async () => {
    const data = { nombre: 'Ortodoncia', precio_unitario: 3000 };
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await TratamientoService.update(5, data);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE tratamiento SET nombre = ?, precio_unitario = ? WHERE tratamiento_id = ?',
      [data.nombre, data.precio_unitario, 5]
    );
    expect(res).toEqual({ tratamiento_id: 5, ...data });
  });

  it('update devuelve null si no se encuentra el id', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });

    const res = await TratamientoService.update(99, { nombre: 'x', precio_unitario: 1 });

    expect(res).toBeNull();
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await TratamientoService.delete(8);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM tratamiento WHERE tratamiento_id = ?',
      [8]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await TratamientoService.delete(123);
    expect(res).toBe(false);
  });
});