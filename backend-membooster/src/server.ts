import express from "express"
import type {Express, Request, Response} from "express"
import { PORT, NODE_ENV } from "./config"

const app : Express = express()

app.get('/', (req: Request, res: Response)=> {
    res.send("Hello")
})

app.listen(PORT, ()=> {
    console.log(`The Server is Up and Running at port ${PORT} in ${NODE_ENV} mode.`)
})