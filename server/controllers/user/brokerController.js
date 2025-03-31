
const User = require('../../models/userModel');

// @desc    Get workers by broker ID
// @route   GET /api/users/workers
// @access  Private/Broker
const getWorkersByBroker = async (req, res) => {
  try {
    const workers = await User.find({ 
      brokerId: req.user._id,
      type: 'worker'
    });

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkersByBroker
};
