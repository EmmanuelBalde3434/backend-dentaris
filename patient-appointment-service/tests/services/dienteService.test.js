const DienteService = require('../../src/services/dienteService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('DienteService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de dientes', async () => {
    const rows = [{ diente_id: 1, odontograma_id: 5, codigo: '11', posicion: 'sup-der' }];
    db.query.mockResolvedValueOnce(rows);

    const res = await DienteService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM diente');
    expect(res).toEqual(rows);
  });

  it('getById devuelve diente existente', async () => {
    const row = { diente_id: 2, odontograma_id: 6, codigo: '12', posicion: 'sup-izq' };
    db.query.mockResolvedValueOnce([row]);

    const res = await DienteService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM diente WHERE diente_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve el diente nuevo', async () => {
    const data = { odontograma_id: 7, codigo: '13', posicion: 'inf-der' };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const res = await DienteService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO diente (odontograma_id, codigo, posicion) VALUES (?, ?, ?)',
      [data.odontograma_id, data.codigo, data.posicion]
    );
    expect(res).toEqual({ diente_id: 10, ...data });
  });

  it('update devuelve objeto cuando afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const data = { codigo: '14', posicion: 'inf-izq' };
    const res = await DienteService.update(4, data);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE diente SET codigo = ?, posicion = ? WHERE diente_id = ?',
      [data.codigo, data.posicion, 4]
    );
    expect(res).toEqual({ diente_id: 4, ...data });
  });

  it('update devuelve null cuando id inexistente', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await DienteService.update(99, { codigo: 'x', posicion: 'x' });
    expect(res).toBeNull();
  });

  it('delete devuelve true si elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await DienteService.delete(8);
    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM diente WHERE diente_id = ?',
      [8]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await DienteService.delete(123);
    expect(res).toBe(false);
  });
});