
// Import all the controller modules
const customerController = require('./order/customerController');
const workerController = require('./order/workerController');
const brokerController = require('./order/brokerController');
const commonController = require('./order/commonController');

// Re-export all functionality
module.exports = {
  // Customer operations
  createOrder: customerController.createOrder,
  getCustomerOrders: customerController.getCustomerOrders,
  addOrderReview: customerController.addOrderReview,
  
  // Worker operations
  getWorkerOrders: workerController.getWorkerOrders,
  
  // Broker operations
  getBrokerOrders: brokerController.getBrokerOrders,
  assignWorkerToOrder: brokerController.assignWorkerToOrder,
  
  // Common operations
  getOrderById: commonController.getOrderById,
  updateOrderStatus: commonController.updateOrderStatus,
};
