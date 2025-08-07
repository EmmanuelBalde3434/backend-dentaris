const OdontoService = require('../../src/services/odontogramaService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('OdontogramaService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de odontogramas', async () => {
    const rows = [{ odontograma_id: 1, usuario_id: 5 }];
    db.query.mockResolvedValueOnce(rows);

    const res = await OdontoService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM odontograma');
    expect(res).toEqual(rows);
  });

  it('getById devuelve un odontograma', async () => {
    const row = { odontograma_id: 2, usuario_id: 6 };
    db.query.mockResolvedValueOnce([row]);

    const res = await OdontoService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM odontograma WHERE odontograma_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve el odontograma nuevo', async () => {
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const res = await OdontoService.create({ usuario_id: 7 });

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO odontograma (usuario_id) VALUES (?)',
      [7]
    );
    expect(res).toEqual({ odontograma_id: 10, usuario_id: 7 });
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await OdontoService.delete(4);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM odontograma WHERE odontograma_id = ?',
      [4]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await OdontoService.delete(99);
    expect(res).toBe(false);
  });
});