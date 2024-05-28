import express from "express"
import type {Express, Request, Response} from "express"
import { PORT, NODE_ENV, MORGAN_MODE } from "./config"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"

const app : Express = express()

// If in the server the app runs behind the proxies then setting the below will be helpful to debug
app.enable("trust proxy")

// middlewares setup time brother
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())  // this one is very risky it is allowing everyone, you need to white-list only necessary origins
app.use(morgan('MORGAN_MODE'))


app.get('/', (req: Request, res: Response)=> {
    res.send("Hello")
})

app.listen(PORT, ()=> {
    console.log(`The Server is Up and Running at port ${PORT} in ${NODE_ENV} mode.`)
})