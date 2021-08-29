import * as nodemailer from 'nodemailer';

export function getTransport(NODEMAILER_USER: string, NODEMAILER_PASS: string) {
  const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASS,
    },
  });
  return Transport;
}
