require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Nguyễn Văn Quyết 👻" <chiengaphuly299@gmail.com>', // sender address
    to: dataSend.receiversEmail, // list of receivers
    subject:
      dataSend.language === "vi"
        ? "Thông tin đặt lịch khám bệnh"
        : "Information on scheduling medical examinations", // Subject line
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "en") {
    result = `
    <h3> Hello ${dataSend.patientName} </h3>
    <p>You received this email because you booked an online medical appointment on the BookingCare website</p>
    <p>Information for scheduling medical examination:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>

    <p>If the above information is true, please click on the link
        below to confirm and complete the medical appointment booking procedure.
    </p>
    <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Thank you very much!</div>

    `;
  }
  if (dataSend.language === "vi") {
    result = `
        <h3> Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được mail này vì đã đặt lịch khám bệnh online trên trang web BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link 
            bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
        </p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>

    `;
  }
  return result;
};

let sendAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Nguyễn Văn Quyết 👻" <chiengaphuly299@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject:
      dataSend.language === "vi"
        ? "Thông tin đặt lịch khám bệnh"
        : "Information on scheduling medical examinations", // Subject line
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imageBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "en") {
    result = `
    <h3> Hello ${dataSend.patientName}  </h3>
    <p>You received this email because you booked an online medical appointment on the BookingCare website</p>

    <p>
    We send you the prescription/invoice information sent in the attached file.
    </p>
    <div>Thank you very much!</div>

    `;
  }
  if (dataSend.language === "vi") {
    result = `
        <h3> Xin chào ${dataSend.patientName}! </h3>
        <p>Bạn nhận được mail này vì đã đặt lịch khám bệnh online trên trang web BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh:</p>

        <p>
        Chúng tôi gửi bạn thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm
        </p>
        <div>Xin chân thành cảm ơn!</div>
    `;
  }
  return result;
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
};
