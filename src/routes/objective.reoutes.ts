import { Router } from "express";
import ObjectiveController from "../controllers/ObjectiveController";

const objectiveRouter = Router()
const objectiveController = new ObjectiveController()

objectiveRouter.get("/", (req, res) => {
    return objectiveController.objectives(req, res)
})

objectiveRouter.post("/", (req, res) => {
    return objectiveController.create(req, res)
})

objectiveRouter.put("/complete", (req, res) => {
    return objectiveController.complete(req, res)
})


export default objectiveRouter