import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
const authorize = async (req, res, next) => {
  try {
    let token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // const user = await User.findById(decoded._id).select(
    //   "-password -refreshToken"
    // );
    // if (!user) {
    //   res.status(401);
    //   throw new Error("Unauthorized");
    // }
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    next(error);
  }
};

export default authorize;
