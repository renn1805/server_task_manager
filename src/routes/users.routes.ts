import { Router } from "express"
import UserController from "../controllers/UserController"

const userRoutes = Router()
const userController = new UserController()

userRoutes.get("/users",(req, res) => {
    userController.users(req, res)
})

userRoutes.post("/users",(req, res) => {
    userController.create(req, res)
})

userRoutes.post("/users/delete",(req, res) => {
    userController.delete(req, res)
})

export default userRoutes