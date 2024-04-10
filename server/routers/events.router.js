import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/event.controllers.js";

export const eventsRouter = Router();
eventsRouter.get("/", verifyAccessToken, getAllEvents);
eventsRouter.post("/", verifyAccessToken, createEvent);
// eventsRouter.patch("/:id", verifyAccessToken, updateContact);
eventsRouter.delete("/:id", verifyAccessToken, deleteEvent);
