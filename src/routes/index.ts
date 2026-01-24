import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes"
import workspaceRoutes from "./workspaces.routes";
const routes = Router()

routes.use('/users', userRoutes)
routes.use('/tasks', tasksRoutes)
routes.use('/workspaces', workspaceRoutes)
export default routes