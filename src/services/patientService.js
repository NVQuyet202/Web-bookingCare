import db from "../models/index";
require("dotenv").config();
import _, { reject } from "lodash";
import emailService from "./emailService";

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName
      ) {
        resolve({
          errCode: 1,
          errMesage: "Missing parameter!",
        });
      } else {
        await emailService.sendSimpleEmail({
          receiversEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: "https://bookingcare.vn/",
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientid: user[0].id,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientid: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }

        resolve({
          errCode: 0,
          errMesage: "Save infor apppointment succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment,
};
