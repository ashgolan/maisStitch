import { Router } from "express";

import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClient,
  updateClient,
} from "../controllers/client.controller.js";

export const clientRouter = Router();
clientRouter.get("/", verifyAccessToken, getAllClients);
clientRouter.get("/:id", verifyAccessToken, getClient);
clientRouter.post("/", verifyAccessToken, createClient);
clientRouter.patch("/:id", verifyAccessToken, updateClient);
clientRouter.delete("/:id", verifyAccessToken, deleteClient);
