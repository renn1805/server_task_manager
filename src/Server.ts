import { app } from "./app"
import routes from "./routes"


app.use(routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))

const smallerId = 7
const mediumId = 8
const largeId = 9

export const sizeTeamId = largeId
export const sizeTeamMemberId = mediumId

export const sizeWorspaceId = largeId
export const sizeWorspaceMemberId = mediumId

export const sizeCommentId = smallerId

export const sizeObjectiveId = largeId
export const sizeTaskId = largeId
export const sizeUserId = 11