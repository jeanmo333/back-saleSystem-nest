
import * as nodemailer from 'nodemailer';


export interface dataMail {
  email:string
  name:string
  token:string
}


const emailRegistro = async (data:dataMail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  //Enviar el email

  const info = await transporter.sendMail({
    from: "AMATEC - Administrador de ventas ",
    to: email,
    subject: "Comprueba tu cuenta en AMATEC",
    text: "Comprueba tu cuenta en AMATEC",
    html: `<p>Hola: ${name}, comprueba tu cuenta en AMATEC.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/auth/confirmAccount/${token}">Comprobar Cuenta</a> </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;
