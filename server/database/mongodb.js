import mongoose from "mongoose";

import { MONGO_URL, NODE_ENV } from "../config/env.js";

if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.<develop/production.local"
  );
}
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
