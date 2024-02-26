/* eslint-disable comma-dangle */
/* eslint-disable indent */
import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  getUserDetails,
  testUser,
} from "../controllers/users.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/test", testUser);
router.get("/", Auth, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/details", Auth, getUserDetails);

export default router;
