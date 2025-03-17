
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [name]
 * @property {string} [avatar]
 * @property {string} type - User type: "customer", "worker", or "broker"
 * @property {string} [phone]
 * @property {Object} [address]
 * @property {string} [address.street]
 * @property {string} [address.city]
 * @property {string} [address.state]
 * @property {string} [address.zipCode]
 * @property {string} [address.country]
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {Object} location
 * @property {string} [location.address]
 * @property {string} [location.city]
 * @property {string} [location.state]
 * @property {string} [location.zipCode]
 * @property {string} status - Order status: "pending", "assigned", "in_progress", "completed", "cancelled"
 * @property {number} [price]
 * @property {string} customerId
 * @property {string} [workerId]
 * @property {string} [brokerId]
 * @property {Date} [startDate]
 * @property {Date} [endDate]
 * @property {Date} createdAt
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} content
 * @property {string} senderId
 * @property {string} receiverId
 * @property {string} [orderId]
 * @property {boolean} isRead
 * @property {Date} createdAt
 * @property {string[]} [attachments]
 */

// Export an empty object since we're using JSDoc comments instead of TypeScript
export {};
