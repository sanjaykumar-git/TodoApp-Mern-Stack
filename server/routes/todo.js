import express from "express";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
} from "../controllers/todocontoller.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.get("/",verifyToken, getAllTodos);
router.post("/",verifyToken, addTodo);
router.put("/:id",verifyToken, updateTodo);
router.get("/:id",verifyToken, getTodo);
router.delete("/:id",verifyToken, deleteTodo);

export default router;
