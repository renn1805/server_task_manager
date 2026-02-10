import { Router } from "express";
import { TeamController } from "../controllers/TeamController"

const teamController = new TeamController()
const teamRouter = Router()

teamRouter.get("/:workspace", (req, res) => {
    teamController.teams(req, res)
})

teamRouter.post("/", (req, res) => {
    teamController.create(req, res)
})

teamRouter.post("/include", (req, res) => {
    teamController.include(req, res)
})

teamRouter.post("/remove", (req, res) => {
    teamController.remove(req, res)
})

export default teamRouter