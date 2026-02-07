import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes"
import workspaceRoutes from "./workspaces.routes";
import teamRouter from "./team.routes";
import objectiveRouter from "./objective.reoutes";
const routes = Router()

routes.get("/ping", (req, res) => {
    res.status(200).send("pong");
});
routes.use('/users', userRoutes)
routes.use('/tasks', tasksRoutes)
routes.use('/workspaces', workspaceRoutes)
routes.use("/team", teamRouter)
routes.use("/objectives", objectiveRouter)
export default routes