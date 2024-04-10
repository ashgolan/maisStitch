import { Router } from "express";
import {
  createSale,
  deleteSale,
  getAllSales,
  getSale,
  updateSale,
} from "../controllers/sale.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const saleRouter = Router();
saleRouter.get("/", verifyAccessToken, getAllSales);
saleRouter.get("/:id", verifyAccessToken, getSale);
saleRouter.post("/", verifyAccessToken, createSale);
saleRouter.patch("/:id", verifyAccessToken, updateSale);
saleRouter.delete("/:id", verifyAccessToken, deleteSale);
