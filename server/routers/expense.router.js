import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
} from "../controllers/expense.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const expenseRouter = Router();
expenseRouter.get("/", verifyAccessToken, getAllExpenses);
expenseRouter.get("/:id", verifyAccessToken, getExpense);
expenseRouter.post("/", verifyAccessToken, createExpense);
expenseRouter.patch("/:id", verifyAccessToken, updateExpense);
expenseRouter.delete("/:id", verifyAccessToken, deleteExpense);
