const BalanceService = require('../../src/services/balanceService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

const AVG = 800; 

describe('BalanceService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('create inserta movimiento y devuelve objeto', async () => {
    db.query.mockResolvedValueOnce({ insertId: 55 });

    const data = {
      consultorio_id: 3,
      monto: 250,
      tipo_mov: 'Egreso',
      plan_id: null,
      insumo_id: 7
    };

    const res = await BalanceService.create(data);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO balance'),
      [3, 250, 'Egreso', null, 7]
    );
    expect(res).toEqual({ balance_id: 55, ...data });
  });

  it('getAll devuelve lista de movimientos', async () => {
    const rows = [{ balance_id: 1, consultorio_id: 3 }];
    db.query.mockResolvedValueOnce(rows);

    const res = await BalanceService.getAll(3);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM balance WHERE consultorio_id = ? ORDER BY fecha DESC',
      [3]
    );
    expect(res).toEqual(rows);
  });

  it('getById devuelve movimiento específico', async () => {
    const row = { balance_id: 4, consultorio_id: 3 };
    db.query.mockResolvedValueOnce([row]);

    const res = await BalanceService.getById(4, 3);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM balance WHERE balance_id = ? AND consultorio_id = ?',
      [4, 3]
    );
    expect(res).toEqual(row);
  });

  it('syncIngresosPorCitas inserta un ingreso promedio por cada cita realizada pendiente', async () => {
    const pendientes = [
      { plan_id: 10, consultorio_id: 2 },
      { plan_id: 11, consultorio_id: 2 }
    ];
    db.query
      .mockResolvedValueOnce(pendientes) 
      .mockResolvedValueOnce({})        
      .mockResolvedValueOnce({});       

    const inserted = await BalanceService.syncIngresosPorCitas();

    expect(inserted).toBe(2);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO balance'),
      [2, AVG, 10]
    );
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO balance'),
      [2, AVG, 11]
    );
  });

  it('syncIngresosPorCitas devuelve 0 si no hay citas pendientes', async () => {
    db.query.mockResolvedValueOnce([]);  

    const inserted = await BalanceService.syncIngresosPorCitas();

    expect(inserted).toBe(0);
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});