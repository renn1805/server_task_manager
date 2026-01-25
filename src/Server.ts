import {app} from "./app"
import routes from "./routes"


const port = 3000
app.listen(port, () => console.log("The server is running"))

app.use(routes)

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