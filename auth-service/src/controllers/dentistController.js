const DentistService = require('../services/dentistService');

exports.createDentist = async (req,res)=>{
  try{
    const { consultorio_id } = req.user;
    const out = await DentistService.createDentist(req.body, consultorio_id);
    res.status(201).json({ success:true, ...out });
  }catch(e){
    res.status(400).json({ success:false, error:e.message });
  }
};

exports.listDentists = async (req,res)=>{
  try{
    const { consultorio_id } = req.user;
    const dentists = await DentistService.listDentists(consultorio_id);
    res.json({ success:true, dentists });
  }catch(e){
    res.status(500).json({ success:false, error:e.message });
  }
};

exports.getDentist = async (req,res)=>{
  try{
    const { consultorio_id } = req.user;
    const dentist = await DentistService.getDentistById(req.params.id, consultorio_id);
    res.json({ success:true, dentist });
  }catch(e){
    res.status(404).json({ success:false, error:e.message });
  }
};

exports.updateDentist = async (req,res)=>{
  try{
    const { consultorio_id } = req.user;
    const out = await DentistService.updateDentist(req.params.id, req.body, consultorio_id);
    res.json({ success:true, ...out });
  }catch(e){
    res.status(400).json({ success:false, error:e.message });
  }
};

exports.deleteDentist = async (req,res)=>{
  try{
    const { consultorio_id } = req.user;
    const out = await DentistService.deleteDentist(req.params.id, consultorio_id);
    res.json({ success:true, ...out });
  }catch(e){
    res.status(404).json({ success:false, error:e.message });
  }
};
