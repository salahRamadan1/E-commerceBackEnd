import nodemailer from 'nodemailer'
const sendEmail = async (email, message) => {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'sasamama1915@outlook.com',
      pass: process.env.PASSWORDOUTLOOK,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"salah" <sasamama1915@outlook.com>', // sender address
    to: email, // list of receivers
    html: message, // html body
  });

}
export { sendEmail }