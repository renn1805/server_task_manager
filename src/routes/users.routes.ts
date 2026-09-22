import { Router } from "express";
import UserController from "../controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", (req, res) => {
    return userController.users(req, res);
});

userRoutes.get("/:id", (req, res) => {
    return userController.userById(req, res);
});

userRoutes.post("/login", (req, res) => {
    return userController.login(req, res);
});

userRoutes.post("/", (req, res) => {
    return userController.create(req, res);
});

userRoutes.post("/delete", (req, res) => {
    return userController.delete(req, res);
});

export default userRoutes;
