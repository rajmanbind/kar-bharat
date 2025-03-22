
const User = require('../models/userModel');
const { z } = require('zod');

// Search validation schema using Zod
const searchSchema = z.object({
  skills: z.string().optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
});

/**
 * @desc    Search workers by skills, location, and rating
 * @route   GET /api/users/search
 * @access  Public
 */
const searchWorkers = async (req, res) => {
  try {
    // Validate search params
    const validation = searchSchema.safeParse({
      skills: req.query.skills,
      location: {
        city: req.query.city,
        state: req.query.state,
      },
      rating: req.query.rating ? Number(req.query.rating) : undefined,
    });

    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid search parameters',
        errors: validation.error.errors
      });
    }

    // Build search query
    const query = { type: 'worker' };
    
    // Search by skills
    if (req.query.skills) {
      query.skills = { $in: req.query.skills.split(',') };
    }
    
    // Search by location
    if (req.query.city) {
      query['address.city'] = { $regex: req.query.city, $options: 'i' };
    }
    if (req.query.state) {
      query['address.state'] = { $regex: req.query.state, $options: 'i' };
    }
    
    // Search by rating
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    const workers = await User.find(query)
      .select('-password')
      .populate('brokerId', 'name email phone')
      .limit(50); // Limit results for performance

    res.json(workers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchWorkers,
};
