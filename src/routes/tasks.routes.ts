import { Router } from "express";
import TaskController from "../controllers/TaskController";

const tasksRoutes = Router()
const taskController = new TaskController()

tasksRoutes.post("/", (req, res) => {
    taskController.create(req, res)
})

tasksRoutes.post("/delete", (req, res) => {
    taskController.delete(req, res)
})

export default tasksRoutes