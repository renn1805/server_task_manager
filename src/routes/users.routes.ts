import { Router } from "express"
import UserController from "../controllers/UserController"

const userRoutes = Router()
const userController = new UserController()

userRoutes.get("/",(req, res) => {
    userController.users(req, res)
})

userRoutes.post("/",(req, res) => {
    userController.create(req, res)
})

userRoutes.post("/delete",(req, res) => {
    userController.delete(req, res)
})

export default userRoutes