import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    let infor = await clinicService.createClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinic();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let handleDeleteClinic = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await clinicService.deleteClinic(req.body.id);
  return res.status(200).json(message);
};

let handleEditClinic = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await clinicService.updateClinic(req.body);
  return res.status(200).json(message);
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
  handleDeleteClinic,
  handleEditClinic,
};
