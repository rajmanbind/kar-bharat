import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { getSkillList } from "../controllers/admin.controller.js";


const adminRoutes = Router();
adminRoutes.get('/skill-list',authorize,getSkillList)
export default adminRoutes;