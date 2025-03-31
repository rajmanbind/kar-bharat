// import dayjs from "dayjs";
// import { emailTemplates } from "./email-template.js";
// import transporter, { accountEmail } from "../config/nodemailer.js";

// export const sendReminderEmail = async ({ to, type, subscription }) => {
//   if (!to || !type) throw new Error("Missing required parameters");

//   const template = emailTemplates.find((t) => t.label === type);

//   if (!template) throw new Error("Invalid email type");

//   const mailInfo = {
//     userName: subscription.user.name,
//     subscriptionName: subscription.name,
//     renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
//     planName: subscription.name,
//     price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
//     paymentMethod: subscription.paymentMethod,
//   };

//   const message = template.generateBody(mailInfo);
//   const subject = template.generateSubject(mailInfo);

//   const mailOptions = {
//     from: accountEmail,
//     to: to,
//     subject: subject,
//     html: message,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) return console.log(error, "Error sending email");

//     console.log("Email sent: " + info.response);
//   });
// };

import { ACCOUNT_MAIL, OTP_EXPIRY } from "../../config/env.js";
import transporter from "../../config/nodemailer.js";
import { otpEmailTemplate } from "./email-template.js";

export const sendOTPEmail = async ({ to, userName, otp }) => {
  if (!to || !userName || !otp) {
    throw new Error("Missing required parameters (to, userName, or otp)");
  }

  const mailInfo = {
    userName,
    otp,
    supportLink: "https://yourwebsite.com/support", // Update with your actual support link
    otpExpiryMinutes:OTP_EXPIRY/60
  };

  const message = otpEmailTemplate.generateBody(mailInfo);
  const subject = otpEmailTemplate.generateSubject();

  const mailOptions = {
    from: ACCOUNT_MAIL,
    to: to,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};