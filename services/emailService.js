const nodemailer = require('nodemailer');

const enviarCorreoBienvenida = async (emailDestino, nombre) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_SG,
      pass: process.env.PASS_CORREO_SG
    },
  });

  const mailOptions = {
    from: 'SG Studio <' + process.env.CORREO_SG + '>',
    to: emailDestino,
    subject: '¡Bienvenido a SG Studio!',
    text: `Hola ${nombre},\n\nGracias por registrarte en la Página Oficial de SG Studio!!!\n\nEsperamos con ansias tus pedidos vía WhatsApp. Solo hazlo por nuestra página oficial!\n\nSaludos,\nEl equipo de SG Studio 🎨`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoBienvenida };
