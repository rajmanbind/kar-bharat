const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!req.user ||!allowedRoles.includes(req.user.role)) {
          const error = new Error(`Access denied to :  ${req.user.role}`);
          error.statusCode = 403;
          throw error;
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };
  
  export default checkRole;
  