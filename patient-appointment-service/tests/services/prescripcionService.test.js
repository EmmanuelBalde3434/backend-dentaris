const PrescService = require('../../src/services/prescripcionService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('PrescripcionService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de prescripciones', async () => {
    const rows = [{ prescripcion_id: 1, cita_id: 5, farmaco: 'Ibuprofeno' }];
    db.query.mockResolvedValueOnce(rows);

    const res = await PrescService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM prescripcion');
    expect(res).toEqual(rows);
  });

  it('getById devuelve una prescripción', async () => {
    const row = { prescripcion_id: 2, cita_id: 6, farmaco: 'Amoxicilina' };
    db.query.mockResolvedValueOnce([row]);

    const res = await PrescService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM prescripcion WHERE prescripcion_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve la prescripción nueva', async () => {
    const data = {
      cita_id: 7,
      farmaco: 'Paracetamol',
      marca:   'Tempra',
      dosificacion: '500 mg',
      cantidad: 20,
      frecuencia: 'Cada 8 h',
      duracion: 5
    };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const res = await PrescService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO prescripcion'),
      [7, 'Paracetamol', 'Tempra', '500 mg', 20, 'Cada 8 h', 5]
    );
    expect(res).toEqual({ prescripcion_id: 10, ...data });
  });

  it('update devuelve objeto actualizado cuando afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const data = {
      farmaco: 'Diclofenaco',
      marca: 'Voltaren',
      dosificacion: '75 mg',
      cantidad: 14,
      frecuencia: 'Cada 12 h',
      duracion: 7
    };
    const res = await PrescService.update(4, data);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE prescripcion SET'),
      ['Diclofenaco', 'Voltaren', '75 mg', 14, 'Cada 12 h', 7, 4]
    );
    expect(res).toEqual({ prescripcion_id: 4, ...data });
  });

  it('update devuelve null cuando id inexistente', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PrescService.update(99, { farmaco: 'x' });
    expect(res).toBeNull();
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await PrescService.delete(8);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM prescripcion WHERE prescripcion_id = ?',
      [8]
    );
    expect(res).toBe(true);
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PrescService.delete(123);
    expect(res).toBe(false);
  });
});