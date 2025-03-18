
/**
 * Validates if a status transition is valid based on user type and current status
 * @param {string} currentStatus - The current order status
 * @param {string} newStatus - The requested new status
 * @param {string} userType - The type of user making the request
 * @returns {boolean} - Whether the status transition is valid
 */
const validateStatusChange = (currentStatus, newStatus, userType) => {
  // Define valid transitions for each user type
  const validTransitions = {
    broker: {
      pending: ['assigned', 'cancelled'],
      assigned: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
    },
    worker: {
      assigned: ['in_progress'],
      in_progress: ['completed'],
    },
    customer: {
      pending: ['cancelled'],
      assigned: ['cancelled'],
      in_progress: ['cancelled'],
      completed: ['completed'], // Can leave review on completed order
    },
  };

  // Check if the transition is valid
  if (validTransitions[userType] && validTransitions[userType][currentStatus]) {
    return validTransitions[userType][currentStatus].includes(newStatus);
  }

  return false;
};

module.exports = {
  validateStatusChange,
};
