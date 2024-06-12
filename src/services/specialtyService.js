import db from "../models/index";

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMesage: "Missing parameter!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
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

let deleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: id },
      });
      if (!specialty) {
        resolve({
          errCode: 2,
          errMessage: "The Specialty isn't exist",
        });
      }
      await db.Specialty.destroy({
        where: { id: id },
      });

      resolve({
        errCode: 0,
        message: "The Specialty is deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({});
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

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMesage: "Missing parameter!",
        });
      }

      let data = await db.Specialty.findOne({
        where: {
          id: inputId,
        },
        attributes: ["descriptionHtml", "descriptionMarkdown", "name"],
      });

      if (data) {
        let doctorSpecialty = [];
        if (location === "ALL") {
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: { specialtyId: inputId },
            attributes: ["doctorId", "provinceId"],
          });
        } else {
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: { specialtyId: inputId, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
        }
        data.doctorSpecialty = doctorSpecialty;
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

let updateSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.descriptionHtml || !data.descriptionMarkdown) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.specialtyEdit },
        raw: false,
      });
      if (specialty) {
        specialty.name = data.name;
        if (data.imageBase64) {
          specialty.image = data.imageBase64;
        }
        specialty.descriptionHtml = data.descriptionHtml;
        specialty.descriptionMarkdown = data.descriptionMarkdown;

        await specialty.save();

        resolve({
          errCode: 0,
          message: "Update the Specialty succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Specialty's not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createSpecialty,
  deleteSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  updateSpecialty,
};
