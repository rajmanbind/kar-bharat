import {
  registerSchema,
  registerSchemaTwo,
} from "../../validations/register.validation.js";
import mongoose from "mongoose";
import redisClient from "../../config/redis.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../../config/env.js";
import User from "../../models/user.model.js";
import uplaodCloudinary from "../../utils/cloudinary.js";
import loginSchema from "../../validations/login.validation.js";
import { sendOTPEmail } from "../../utils/email/send-mail.js";
import { generateOTP, storeOTP, verifyOtp } from "../../utils/otp.utils.js";
import emailSchema from "../../validations/email.validation.js";
import verifyOTPSchema from "../../validations/verifyOTP.validation.js";
import WorkerSkill from "../../models/skill.model.js";
// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, userType: user.userType, email: user.email } },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

const generateAccessAndRefereshTokens = async (user, next) => {
  try {
    //   const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  let session;

  try {
    // Start MongoDB session and transaction
    session = await mongoose.startSession();
    session.startTransaction();
    const {
      name,
      email,
      password,
      cnf_password,
      phone,
      userType,
      address,
      skills,
      brokerId,
      otpVerified,
    } = req.body;

    // Validate user data with Zod
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      //   await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid user data",
        errors: validation.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }
    // Check if the email is verified
    const verifiedKey = `otp:verified:${email}`;

    const isEmailVerified = await redisClient.get(verifiedKey);
    if ((!isEmailVerified || isEmailVerified !== "true") && !otpVerified) {
      res.status(400);
      throw new Error("Email verification required.");
    }

    const userExists = await User.findOne({ email }).session(session);

    if (userExists) {
      res.status(409);
      throw new Error("User already exists");
    }

    // Create user based on type
    const user = await User.create(
      [
        {
          name,
          email,
          password,
          userType,
        },
      ],
      { session }
    ).then((users) => users[0]);

    if (!user) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    // Cache user in Redis
    // try {
    //   const userCache = {
    //     _id: user._id.toString(),
    //     name: user.name,
    //     email: user.email,
    //     userType: user.userType,
    //   };

    //   await redisClient.set(`user:${user._id}`, JSON.stringify(userCache), {
    //     EX: 86400, // 24 hours
    //   });
    // } catch (redisError) {
    //   throw redisError;
    // }

    // const token = generateToken(user);

    const isProduction = NODE_ENV === "production";

    const options = {
      httpOnly: true,
      secure: isProduction === "production",
      sameSite: isProduction ? "strict" : "lax",
    };

    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
      user,
      next
    );

    await redisClient.del(verifiedKey);
    // Commit transaction
    await session.commitTransaction();

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "user registered successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
        token: { accessToken, refreshToken },
      });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session?.endSession();
  }
};
export const registerUserTwo = async (req, res, next) => {
  let session;

  try {
    // Start MongoDB session and transaction
    session = await mongoose.startSession();
    session.startTransaction();
    const { phone, address, brokerId, otpVerified } = req.body;
    // console.log("body", req.body); // Text fields
    // console.log(req.file);
    // Parse skills from JSON string to array
    let skills = [];
    if (req.body.skills) {
      try {
        let skilll = JSON.parse(req.body.skills);
        const listOfSkill = await WorkerSkill.find({}).session(session)
         skills = listOfSkill
        .filter(skill => skilll.includes(skill.name))
        .map(skill => skill.name); 
      } catch (e) {
        throw e;
      }
    }
// console.log("ADDRESS",address.street)
    // Create validated data
    const validatedData = {
      ...req.body,
      skills,
      address:JSON.parse(req.body.address)
    };

    // Validate user data with Zod
    const validation = registerSchemaTwo.safeParse(validatedData);
    if (!validation.success) {
      //   await session.abortTransaction();
      // console.log(req.body)
      return res.status(400).json({
        message: "Invalid user data",
        errors: validation.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }

    const userExists = await User.findById(req.user._id).session(session);

    if (!userExists) {
      res.status(404);
      throw new Error("User not found");
    }
    let validatedBrokerId = userExists.brokerId;
    if (userExists.userType === "worker") {
      if (!skills || skills.length === 0) {
        res.status(400);
        throw new Error("Skills are required for workers");
      }

      if (brokerId) {
        const broker = await User.findById(brokerId).session(session);
        if (!broker) {
          res.status(409);
          throw new Error("No broker exist");
        }
        validatedBrokerId = brokerId;
      }
    }

    // // console.log("files: ",req.files)
    // console.log("files: ", req.file);
    // let profileImageLocalPath;
    // if (
    //   req.file &&
    //   eq.file.profileImage
    // ) {
    //   // profileImageLocalPath = req.files?.profileImage[0]?.path;
    //   profileImageLocalPath = req.files?.profileImage
    //   console.log(profileImageLocalPath);
    // }

    // if (!profileImageLocalPath) {
    //   res.status(400);
    //   throw new Error("Profile image is required!");
    // }
    // // console.log(profileImageLocalPath, coverLocalPath);
    // let profileImage = null;
    // if (profileImageLocalPath) {
    //   profileImage = await uplaodCloudinary(profileImageLocalPath);
    // }

    // if (!profileImage) {
    //   res.status(400);
    //   throw new Error("Profile image is required!");
    // }
    let profileImage = null;
    if (!userExists.profileImage) {
      console.log("Uploaded file:", req.file); // This will show the single uploaded file
      let profileImageLocalPath;
      if (req.file) {
        profileImageLocalPath = req.file.path; // Access the path directly from req.file
        console.log("Profile image path:", profileImageLocalPath);
      }

      if (!profileImageLocalPath) {
        res.status(400);
        throw new Error("Profile image is required!");
      }

      try {
        profileImage = await uplaodCloudinary(profileImageLocalPath); // Fixed typo in function name
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(500);
        throw new Error("Failed to upload profile image");
      }

      if (!profileImage) {
        res.status(400);
        throw new Error("Profile image upload failed!");
      }
    } else {
      let profileImageLocalPath;
      if (req.file) {
        profileImageLocalPath = req.file.path; // Access the path directly from req.file
        console.log("Profile image path:", profileImageLocalPath);
      }

      if (!profileImageLocalPath) {
        console.log("Profile image is required!");
      }

      try {
        profileImage = await uplaodCloudinary(profileImageLocalPath); // Fixed typo in function name
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        console.log("Failed to upload profile image");
      }

      if (!profileImage) {
        console.log("Profile image upload failed!");
      }
    }
    // Prepare update object with only provided fields
    const updateData = {
      ...(phone && { phone }),
      ...(address && { address:JSON.parse(req.body.address) }),
      ...(skills && { skills }),
      ...(validatedBrokerId && { brokerId: validatedBrokerId }),
      ...(profileImage && { profileImage: profileImage.secure_url }),
    };

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      session,
    });

    // Update Redis cache
    // try {
    //   const userCache = {
    //     _id: updatedUser._id.toString(),
    //     name: updatedUser.name,
    //     email: updatedUser.email,
    //     userType: updatedUser.userType,
    //     ...(updatedUser.profileImage && {
    //       profileImage: updatedUser.profileImage,
    //     }),
    //   };

    //   await redisClient.set(
    //     `user:${updatedUser._id}`,
    //     JSON.stringify(userCache),
    //     {
    //       EX: 86400, // 24 hours
    //     }
    //   );
    // } catch (redisError) {
    //   console.error("Redis update error:", redisError);
    //   // Continue even if Redis update fails
    // }

    await session.commitTransaction();

    res.status(200).json({
      message: "User details updated successfully",
      data: {
        phone: updatedUser.phone,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        ...(updatedUser.userType === "worker" && {
          skills: updatedUser.skills,
          brokerId: updatedUser.brokerId,
        }),
      },
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session?.endSession();
  }
};
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate user data with Zod
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid user data",
        errors: validation.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isProduction = NODE_ENV === "production";

    const options = {
      httpOnly: true,
      secure: isProduction === "production",
      sameSite: isProduction ? "strict" : "lax",
    };
    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
      user,
      next
    );
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "login successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          address: user.address,
          profileImage: user.profileImage,
          ...(user.userType === "worker" && {
            skills: user.skills,
            brokerId: user.brokerId,
          }),
        },
        token: { refreshToken, accessToken },
      });
  } catch (error) {
    next(error);
  }
};
export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    // Validate user data with Zod
    const validation = emailSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid user data",
        errors: validation.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }
    // Generate OTP
    const otp = generateOTP();
    // console.log("OTP",otp)
    // Store OTP in Redis
    await storeOTP(email, otp);

    await sendOTPEmail({
      to: email,
      userName: email.split("@")[0],
      otp,
    });
    const isProduction = NODE_ENV === "production";
    if (isProduction) {
      res.status(200).json({ message: "OTP sent to email successfully" });
    } else {
      res.status(200).json({ message: `OTP sent to email:${email}`, otp });
    }
  } catch (error) {
    next(error);
  }
};
export const verifyOTP = async (req, res, next) => {
  // verifyOTPSchema
  const { email, otp } = req.body;

  try {
    // Validate user data with Zod
    const validation = verifyOTPSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid user data",
        errors: validation.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }

    const isValid = await verifyOtp(email, otp);

    if (isValid) {
      res.status(200).json({
        verified: true,
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        verified: false,
        message: "Invalid OTP or OTP expired",
      });
    }
  } catch (error) {
    next(error);
  }
};
