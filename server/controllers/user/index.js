
const { registerUser, loginUser } = require('./authController');
const { getUserProfile, updateUserProfile } = require('./profileController');
const { getWorkersByBroker } = require('./brokerController');
const { getAllWorkers } = require('./workerController');
const { getAllBrokers } = require('./brokerListController');

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getWorkersByBroker,
  getAllWorkers,
  getAllBrokers,
};
