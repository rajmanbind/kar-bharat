import { Router } from "express";
import { searchWorker } from "../controllers/user/workerController.js";
import authorize from "../middleware/auth.middleware.js";

const userRoutes = Router()


userRoutes.get("/search-worker",authorize,searchWorker)


export default userRoutes;