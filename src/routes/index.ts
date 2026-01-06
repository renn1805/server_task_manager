import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes"
const routes = Router()

routes.use('/users', userRoutes)
routes.use('/tasks', tasksRoutes)
export default routes