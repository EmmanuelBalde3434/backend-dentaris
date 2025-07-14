const ConsultorioService = require('../services/consultorioService');

exports.getConsultorio = async (req, res) => {
  try {
    const { consultorio_id } = req.user;        
    const consultorio = await ConsultorioService.getConsultorioById(consultorio_id);
    res.json({ success: true, consultorio });
  } catch (e) {
    res.status(404).json({ success: false, error: e.message });
  }
};