// @desc    Get all workers (for customers to browse)
// @route   GET /api/users/workers/all

// const { default: User } = require("../../models/user.model");
import User from "../../models/user.model.js";
// @access  Public
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await User.find({
      userType: "worker",
    })
      .select("-password")
      .limit(100); // Limit to 100 workers for performance

    res
      .status(200)
      .json({ message: "worker fetched successfully", data: workers });
  } catch (error) {
    next(error);
  }
};
export const searchWorker = async (req, res, next) => {
  try {
    const { query, skills, location, rating } = req.query;

    // Build the database query
    const dbQuery = { userType: "worker" };

    // 1. Text search (for name/description)
    if (query) {
      dbQuery.$or = [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
        { description: { $regex: query, $options: 'i' } } // Search in worker's bio
      ];
    }

    // 2. Skills filter (assuming skills is a comma-separated string)
    if (skills) {
      console.log("skill: ", skills);
      if (skills.toLowerCase() === "all") {
        // Remove skills filter if skills is "all"
        delete dbQuery.skills;
      } else {
        const skillsArray = skills.split(',');
        dbQuery.skills = { $in: skillsArray }; // Workers with ANY of these skills
      }
    }
    // 3. Location filter
    if (location) {
      dbQuery['address.city'] = { $regex: location, $options: 'i' }; // Case-insensitive city search
    }

    // 4. Minimum rating filter
    if (rating) {
      dbQuery.rating = { $gte: Number(rating) }; // Workers with rating >= specified
    }

    // Execute query
    const workers = await User.find(dbQuery)
      .select("-password")
      .limit(100);

    res.status(200).json({ 
      success: true,
      message: "Workers fetched successfully", 
      data: workers 
    });

  } catch (error) {
    next(error);
  }
};