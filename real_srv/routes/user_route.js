import express from "express";
import {
  updateUser,
  deleteUser,
  getUserListings,
} from "../controllers/user_controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", getUserListings);

export default router;
