import { Router } from "express";
import TaskController from "../controllers/TaskController";

const tasksRoutes = Router()
const taskController = new TaskController()

tasksRoutes.get("/", (req,res)=>{
    taskController.tasks(req, res)
})

tasksRoutes.post("/", (req, res) => {
    taskController.create(req, res)
})

tasksRoutes.delete("/:task", (req, res) => {
    taskController.delete(req, res)
})

export default tasksRoutes