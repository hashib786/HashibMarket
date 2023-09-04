import nodemailer from "nodemailer";
import { IUser } from "../models/userModel";
import { htmlToText } from "html-to-text";

export default class Email {
  public to: string;
  public from: string;
  public name: string;

  constructor(public user: IUser) {
    this.to = user.email;
    this.from = `Hashib Raja <${process.env.EMAIL_FROM}>`;
    this.name = user.name;
  }

  private createTransport() {
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment) {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: parseInt(process.env.MAIL_PORT!) || 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      return transporter;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    return transporter;
  }

  async sendMail(
    subject: string,
    html: string | undefined = "<b>Hashib Market</b>"
  ) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText(html),
    });
  }

  async sendWelcomeMail() {
    const html = welcomeHTMLEmail("localhost:8000", this.name);
    await this.sendMail("Welcome To Hashib Market", html);
  }
}
