import { Router } from "express";
import ObjectiveController from "../controllers/ObjectiveController";

const objectiveRouter = Router()
const objectiveController = new ObjectiveController()

objectiveRouter.get("/", (req, res) => {
    objectiveController.objectives(req, res)
})

objectiveRouter.post("/", (req, res) => {
    objectiveController.create(req, res)
})

objectiveRouter.put("/complete", (req, res) => {
    objectiveController.complete(req, res)
})


export default objectiveRouter