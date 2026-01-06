import {app} from "./app"
import routes from "./routes"


const port = 3000
app.listen(port, () => console.log("The server is running"))

app.use(routes)