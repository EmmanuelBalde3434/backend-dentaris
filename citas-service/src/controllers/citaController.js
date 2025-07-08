// Datos falsos en memoria
let citas = [
  { id: 1, paciente: "admin@dentaris.com", fecha: "2024-05-20", hora: "09:00" }
];

// Obtener todas las citas
exports.obtenerCitas = (req, res) => {
  res.json(citas);
};

// Crear una nueva cita (con validación de auth-service)
exports.crearCita = async (req, res) => {
  try {
    // Verifica el usuario con auth-service (simulado)
    const { paciente, fecha, hora } = req.body;
    
    // Aquí iría la llamada real a auth-service:
    // const response = await axios.get(`http://localhost:5001/api/auth/verify?email=${paciente}`);
    // if (!response.data.valid) throw new Error("Usuario no autorizado");

    const nuevaCita = { id: citas.length + 1, paciente, fecha, hora };
    citas.push(nuevaCita);
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};