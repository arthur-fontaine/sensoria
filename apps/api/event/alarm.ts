import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre_adresse_email@gmail.com',
    pass: 'votre_mot_de_passe',
  },
})

const eventTarget = document.createElement('div') as EventTarget

async function sendEmail() {
  const mailOptions = {
    from: 'votre_adresse_email@gmail.com',
    to: 'adresse_email_destinataire@example.com',
    subject: 'Alarme déclenchée',
    text: 'L\'alarme a été déclenchée.',
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch  {
    throw new Error('Erreur lors de l\'envoi de l\'e-mail')
  }
}

eventTarget.addEventListener('alarm', sendEmail)
