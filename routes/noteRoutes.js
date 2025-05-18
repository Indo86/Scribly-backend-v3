import express from "express";
import { verifyToken } from "../middelware/authMiddelware.js";
import { 
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote, 
} from "../controllers/noteController.js";


const router = express.Router();

router.get("/", verifyToken, getNotes);
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);

export default router;