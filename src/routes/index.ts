import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes"
import workspaceRoutes from "./workspaces.routes";
import teamRouter from "./team.routes";
const routes = Router()

routes.use('/users', userRoutes)
routes.use('/tasks', tasksRoutes)
routes.use('/workspaces', workspaceRoutes)
routes.use("/team", teamRouter)
export default routes