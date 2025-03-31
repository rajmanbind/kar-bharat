import nodemailer from "nodemailer";
import { ACCOUNT_MAIL, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ACCOUNT_MAIL,
    pass: EMAIL_PASSWORD,
  },
});
export default transporter;
