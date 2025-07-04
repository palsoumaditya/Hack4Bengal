import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "@/controllers/user.controller";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
