import { Router } from "express";
import { userControllers } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

export const userRouter = Router();

userRouter.post("/login", userControllers.login);
userRouter.post("/refresh", userControllers.refreshAccessToken);
userRouter.post("/register", userControllers.createUser);
userRouter.delete("/", verifyAccessToken, userControllers.deleteUser);
userRouter.get("/", verifyAccessToken, userControllers.getAllUsers);
userRouter.post("/logout", userControllers.logout);
userRouter.post("/logoutAll/:id", userControllers.logoutAll);
userRouter.patch("/update/", verifyAccessToken, userControllers.updateUser);
