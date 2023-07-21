import nodemailer from 'nodemailer'

import { alarmEvent } from './alarm-event'
import { MAIL_FROM } from './constants'

const transporter = nodemailer.createTransport({
  // TODO
})

alarmEvent.addEventListener('alarm', async (alarm) => {
  for (const userEmail of alarm.userEmails) {
    await sendEmail(userEmail)
  }
})

async function sendEmail(userEmail: string) {
  const mailOptions = {
    from: MAIL_FROM,
    to: userEmail,
    subject: 'Alarme déclenchée',
    text: 'L\'alarme a été déclenchée.',
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch {
    throw new Error('Error while sending email')
  }
}
