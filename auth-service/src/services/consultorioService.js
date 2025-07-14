const { query } = require('./database');

class ConsultorioService {
  static async getConsultorioById(consultorio_id) {
    const [row] = await query(
      `SELECT consultorio_id, nombre, telefono, direccion, logo_url
       FROM   consultorio
       WHERE  consultorio_id = ?`,
      [consultorio_id]
    );

    if (!row) throw new Error('Consultorio no encontrado');
    return row;
  }
}

module.exports = ConsultorioService;
