
const User = require('../../models/userModel');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        address: user.address,
        profileImage: user.profileImage,
        skills: user.skills,
        rating: user.rating,
        ratingCount: user.ratingCount,
        brokerId: user.brokerId,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }
      
      if (req.body.skills) {
        user.skills = req.body.skills;
      }
      
      if (req.file) {
        user.profileImage = req.file.path;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        type: updatedUser.type,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        skills: updatedUser.skills,
        rating: updatedUser.rating,
        ratingCount: updatedUser.ratingCount,
        brokerId: updatedUser.brokerId,
        token: require('./authController').generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
