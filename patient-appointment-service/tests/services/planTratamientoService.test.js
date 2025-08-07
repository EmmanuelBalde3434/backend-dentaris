const PlanService = require('../../src/services/planTratamientoService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('PlanTratamientoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll devuelve lista de planes', async () => {
    const rows = [{ plan_id: 1, cita_id: 5, estado_pago: 'Pendiente', costo_total_estimado: 1200 }];
    db.query.mockResolvedValueOnce(rows);

    const res = await PlanService.getAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM plan_tratamiento');
    expect(res).toEqual(rows);
  });

  it('getById devuelve un plan existente', async () => {
    const row = { plan_id: 2, cita_id: 6, estado_pago: 'Pagado', costo_total_estimado: 800 };
    db.query.mockResolvedValueOnce([row]);

    const res = await PlanService.getById(2);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM plan_tratamiento WHERE plan_id = ?',
      [2]
    );
    expect(res).toEqual(row);
  });

  it('create inserta y devuelve plan con fecha_creacion', async () => {
    const data = { cita_id: 7, estado_pago: 'Pendiente', costo_total_estimado: 1500 };
    db.query.mockResolvedValueOnce({ insertId: 10 });

    const before = Date.now();
    const res = await PlanService.create(data);
    const after  = Date.now();

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO plan_tratamiento'),
      [7, 'Pendiente', 1500]
    );
    expect(res).toMatchObject({ plan_id: 10, ...data });
    expect(res.fecha_creacion.getTime()).toBeGreaterThanOrEqual(before - 50);
    expect(res.fecha_creacion.getTime()).toBeLessThanOrEqual(after + 50);
  });

  it('update devuelve objeto actualizado cuando afecta filas', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const data = { estado_pago: 'Pagado', costo_total_estimado: 1300 };
    const res = await PlanService.update(4, data);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE plan_tratamiento'),
      ['Pagado', 1300, 4]
    );
    expect(res).toEqual({ plan_id: 4, ...data });
  });

  it('update devuelve null cuando id inexistente', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PlanService.update(99, { estado_pago: 'x', costo_total_estimado: 1 });
    expect(res).toBeNull();
  });

  it('delete devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await PlanService.delete(8);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM plan_tratamiento WHERE plan_id = ?',
      [8]
    );
    expect(res).toBe(true); 
  });

  it('delete devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PlanService.delete(123);
    expect(res).toBe(false);
  });
});