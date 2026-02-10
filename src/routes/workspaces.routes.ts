import { Router } from "express"
import WorkspaceController from "../controllers/WorkspaceController"

const workspaceRoutes = Router()
const workspaceController = new WorkspaceController()

workspaceRoutes.get("/", (req, res) => {
    workspaceController.workspaces(req, res)
})

workspaceRoutes.post("/", (req, res) => {
    workspaceController.create(req, res)
})

workspaceRoutes.post("/delete", (req, res) => {
    workspaceController.delete(req, res)
})

workspaceRoutes.post("/complete", (req, res) => {
    workspaceController.complete(req, res)
})

workspaceRoutes.post("/include", (req, res) => {
    workspaceController.include(req, res)
})

workspaceRoutes.post("/remove", (req, res) => {
    workspaceController.remove(req, res)
})


export default workspaceRoutes