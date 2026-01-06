import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes"
const routes = Router()

routes.use(userRoutes)
routes.use(tasksRoutes)
export default routes