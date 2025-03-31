import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true ,trim:true},
    email: { type: String, required: true, unique: true ,trim:true},
    password: { type: String, required: true ,trim:true},
    phone: { type: String, trim:true},
    // address: { type: String ,trim:true},
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true }
    },
    profileImage: { type: String, default: "" },
    userType: {
      type: String,
      required: true,
      enum: ["customer", "worker", "broker"],
    },
    skills: [String],
    rating: { type: Number},
    ratingCount: { type: Number},
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    refreshToken: { type: String },
    lastLogin: {
        type: Date,
        default: Date.now,
      },
  },
 
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  UserSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
        userType: this.userType,
      },
     REFRESH_TOKEN_SECRET,
      {
        expiresIn:REFRESH_TOKEN_EXPIRY,
      }
    );
  };
  UserSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
        userType: this.userType,
      },
     ACCESS_TOKEN_SECRET,
      {
        expiresIn:ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  

const User = mongoose.model("User", UserSchema);

export default User;
