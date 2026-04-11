import { app } from "./app"
import routes from "./routes"


app.use(routes)

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0',() => console.log(`The server is running on port ${PORT}`))


export enum SizeIds {
    sizeUserId = 11,
    smallerId = 7,
    mediumId = 8,
    largeId = 9
}

export const sizeTeamId = SizeIds.largeId
export const sizeTeamMemberId = SizeIds.mediumId

export const sizeWorspaceId = SizeIds.largeId
export const sizeWorspaceMemberId = SizeIds.mediumId

export const sizeCommentId = SizeIds.smallerId

export const sizeObjectiveId = SizeIds.largeId
export const sizeTaskId = SizeIds.largeId
