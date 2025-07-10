const RegisterService = require('../services/registerService');

exports.registerClinic = async (req, res) => {
  const { clinica, telefono, email, password, rol } = req.body;
  try {
    const result = await RegisterService.registerClinicAdmin({
      clinica,
      telefono,
      email,
      password,
      rol
    });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
