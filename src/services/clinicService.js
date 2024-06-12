import db from "../models/index";

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMesage: "Missing parameter!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHtml: data.descriptionHtml,
          descriptionMarkdown: data.descriptionMarkdown,
        });

        resolve({
          errCode: 0,
          errMesage: "Create Succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");

          return item;
        });
      }

      resolve({
        errCode: 0,
        errMesage: "Ok!",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMesage: "Missing parameter!",
        });
      }

      let data = await db.Clinic.findOne({
        where: {
          id: inputId,
        },
        attributes: [
          "descriptionHtml",
          "descriptionMarkdown",
          "name",
          "address",
        ],
      });

      if (data) {
        let doctorClinic = [];

        doctorClinic = await db.Doctor_Infor.findAll({
          where: { clinicId: inputId },
          attributes: ["doctorId", "provinceId"],
        });
        data.doctorClinic = doctorClinic;
      } else {
        data = {};
      }

      resolve({
        errCode: 0,
        errMesage: "Ok!",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: id },
      });
      if (!clinic) {
        resolve({
          errCode: 2,
          errMessage: "The clinic isn't exist",
        });
      }
      await db.Clinic.destroy({
        where: { id: id },
      });

      resolve({
        errCode: 0,
        message: "The clinic is deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: data.clinicEdit },
        raw: false,
      });
      if (clinic) {
        clinic.name = data.name;
        clinic.address = data.address;
        if (data.imageBase64) {
          clinic.image = data.imageBase64;
        }
        clinic.descriptionHtml = data.descriptionHtml;
        clinic.descriptionMarkdown = data.descriptionMarkdown;

        await clinic.save();

        resolve({
          errCode: 0,
          message: "Update the clinic succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Clinic's not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
  deleteClinic,
  updateClinic,
};
