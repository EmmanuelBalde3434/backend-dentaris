const PatientService = require('../services/patientService');

//POST / crear paciente
exports.createPatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;         
    const result = await PatientService.createPatient(req.body, consultorio_id);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET /  listar pacientes
exports.listPatients = async (req, res) => {
  try {
    const { consultorio_id } = req.user;         
    const pacientes = await PatientService.listPatients(consultorio_id);
    res.json({ success: true, pacientes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//PUT / editar pacientes
exports.updatePatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const { id } = req.params;               
    const result = await PatientService.updatePatient(id, req.body, consultorio_id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};