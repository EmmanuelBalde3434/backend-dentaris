const ConsultorioService = require('../../src/services/consultorioService');

jest.mock('../../src/services/database', () => ({
  query: jest.fn()
}));
const db = require('../../src/services/database');

describe('ConsultorioService.getConsultorioById', () => {
  const consultorioRow = {
    consultorio_id: 3,
    nombre:  'Sonrisas Felices',
    telefono:'5544332211',
    direccion: null,
    logo_url: null
  };

  beforeEach(() => jest.clearAllMocks());

  it('devuelve el consultorio cuando existe', async () => {
    db.query.mockResolvedValueOnce([consultorioRow]);

    const result = await ConsultorioService.getConsultorioById(3);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM   consultorio'),
      [3]
    );
    expect(result).toEqual(consultorioRow);
  });

  it('lanza error cuando el consultorio no existe', async () => {
    db.query.mockResolvedValueOnce([]); 

    await expect(
      ConsultorioService.getConsultorioById(99)
    ).rejects.toThrow('Consultorio no encontrado');
  });
});
