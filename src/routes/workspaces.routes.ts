import { Router } from "express"
import WorkspaceController from "../controllers/WorkspaceController"

const workspaceRoutes = Router()
const workspaceController = new WorkspaceController()

workspaceRoutes.get("/", (req, res) => {
    return workspaceController.workspaces(req, res)
})

workspaceRoutes.post("/", (req, res) => {
    return workspaceController.create(req, res)
})

workspaceRoutes.post("/delete", (req, res) => {
    return workspaceController.delete(req, res)
})

workspaceRoutes.post("/complete", (req, res) => {
    return workspaceController.complete(req, res)
})

workspaceRoutes.post("/include", (req, res) => {
    return workspaceController.include(req, res)
})

workspaceRoutes.post("/remove", (req, res) => {
    return workspaceController.remove(req, res)
})


export default workspaceRoutes