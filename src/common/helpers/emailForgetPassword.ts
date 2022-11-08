import * as nodemailer from 'nodemailer';


export interface dataMail {
    email:string
    name:string
    token:string
  }

const emailForgetPassword = async (datos:dataMail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = datos;

  //Enviar el email

  const info = await transporter.sendMail({
    from: "AMATEC - Administrador de Ventas",
    to: email,
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${name}, has solicitado reestablecer tu password.</p>

        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/auth/newPassword/${token}">Reestablecer Password</a> </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailForgetPassword;