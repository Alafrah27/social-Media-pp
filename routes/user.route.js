import express from "express";

import {
  getSuggestedConnections,
  getPuplicProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPuplicProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
