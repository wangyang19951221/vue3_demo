import express from 'express'
import {ok,fail} from './util.js'
import cors from 'cors'
import {urlencoded,json} from "express";

const app = express()
app.use(cors())
app.use(urlencoded({extended: true}))
app.use(json())




app.get("/test",(req,res) => {

    console.log(req.query?.name)
    fail({data:"hello world",res})
})

export default app
