import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
console.log("Path: ", `.env.${process.env.NODE_ENV || "development"}.local`);
export const {
  PORT,
  NODE_ENV,
  MONGO_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SERVER_URL,
  REDIS_URL,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  EMAIL_PASSWORD,
  ACCOUNT_MAIL,
  OTP_EXPIRY
} = process.env;
