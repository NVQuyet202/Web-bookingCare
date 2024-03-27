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
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (!user) {
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

module.exports = {
  createSpecialty,
  deleteSpecialty,
  getAllSpecialty,
};
