const PlanDetalleService = require('../../src/services/planDetalleService');

jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
const db = require('../../src/services/database');

describe('PlanDetalleService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('addTratamiento inserta relación plan-tratamiento', async () => {
    db.query.mockResolvedValueOnce({});   // no importa resultado de INSERT

    const res = await PlanDetalleService.addTratamiento(3, 11);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO plan_tratamiento_tratamiento'),
      [3, 11]
    );
    expect(res).toEqual({ plan_id: 3, tratamiento_id: 11 });
  });

  it('removeTratamiento devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });

    const res = await PlanDetalleService.removeTratamiento(3, 11);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM plan_tratamiento_tratamiento'),
      [3, 11]
    );
    expect(res).toBe(true);
  });

  it('removeTratamiento devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PlanDetalleService.removeTratamiento(99, 88);
    expect(res).toBe(false);
  });

  it('addDiente inserta relación plan-diente', async () => {
    db.query.mockResolvedValueOnce({});

    const res = await PlanDetalleService.addDiente(4, 22);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO plan_tratamiento_diente'),
      [4, 22]
    );
    expect(res).toEqual({ plan_id: 4, diente_id: 22 });
  });

  it('removeDiente devuelve true cuando elimina', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    const res = await PlanDetalleService.removeDiente(4, 22);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM plan_tratamiento_diente'),
      [4, 22]
    );
    expect(res).toBe(true);
  });

  it('removeDiente devuelve false cuando no existe', async () => {
    db.query.mockResolvedValueOnce({ affectedRows: 0 });
    const res = await PlanDetalleService.removeDiente(4, 22);
    expect(res).toBe(false);
  });
});