import dotenv from 'dotenv'

dotenv.config()

let _MAIL_FROM: string | undefined

if (typeof window === 'undefined') {
  _MAIL_FROM = process.env.MAIL_FROM

  if (_MAIL_FROM === undefined) {
    throw new Error('MAIL_FROM is not defined')
  }
} else {
  _MAIL_FROM = ''
}

export const MAIL_FROM = _MAIL_FROM
