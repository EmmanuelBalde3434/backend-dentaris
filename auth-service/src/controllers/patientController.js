const PatientService = require('../services/patientService');

//Crear pacientes
exports.createPatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const out = await PatientService.createPatient(req.body, consultorio_id);
    res.status(201).json({ success: true, ...out });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// Obtener pacientes
exports.listPatients = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const pacientes = await PatientService.listPatients(consultorio_id);
    res.json({ success: true, pacientes });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// Obtener paciente por id
exports.getPatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const paciente = await PatientService.getPatientById(req.params.id, consultorio_id);
    res.json({ success: true, paciente });
  } catch (e) {
    res.status(404).json({ success: false, error: e.message });
  }
};

// Actualizar pacientes
exports.updatePatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const out = await PatientService.updatePatient(req.params.id, req.body, consultorio_id);
    res.json({ success: true, ...out });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

//Eliminar paciente

exports.deletePatient = async (req, res) => {
  try {
    const { consultorio_id } = req.user;
    const out = await PatientService.deletePatient(req.params.id, consultorio_id);
    res.json({ success: true, ...out });
  } catch (e) {
    res.status(404).json({ success: false, error: e.message });
  }
};