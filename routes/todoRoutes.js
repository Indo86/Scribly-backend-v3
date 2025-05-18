import express from "express";
import { verifyToken } from "../middelware/authMiddelware.js";
import { 
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", verifyToken, getTodos);
router.get("/:id", verifyToken, getTodoById);
router.post("/", verifyToken, createTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;