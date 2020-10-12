const nodemailer = require("nodemailer");

const credentials = {
  web: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
};

const tokens = {
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  expiry_date: process.env.EXPIRE,
};

const EMAIL_USERNAME = "llullmbelen@gmail.com";
const COMMON_NAME = "Simona diseño";

const nodemailerSettings = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  from: `"${COMMON_NAME}" <${EMAIL_USERNAME}>`,
  auth: {
    type: "OAuth2",
    user: EMAIL_USERNAME,
    clientId: credentials.web.client_id,
    clientSecret: credentials.web.client_secret,
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    expires: tokens.expiry_date,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const gmailTransport = nodemailer.createTransport(nodemailerSettings);

async function sendEmail(name, phone, email, message) {
  await gmailTransport.sendMail({
    from: "llullmbelen@gmail.com",
    to: "llullmbelen@gmail.com",
    subject: "Consulta desde la pagina",
    html: `
    <div
      style="
        padding: 16px 46px;
        color: white;
        background-color: #33b5e5;
        width: 500px;
      "
    >
      <h1>Nuevo mensaje recibido</h1>
      <h2>Información</h2>
      <ul>
        <li style="font-size: 18px;">Nombre: ${name}</li>
        <li style="font-size: 18px;">Telefono: ${phone ? phone : ""}</li>
        <li style="font-size: 18px;">Email: ${email ? email : ""}</li>
        <li style="font-size: 18px;">
          Mensaje: ${message}
        </li>
      </ul>
    </div>
    `,
  });
}

module.exports = { sendEmail };
