import express from 'express'
import {ok,fail,generateToken,verifyToken} from './util.js'
import cors from 'cors'
import {urlencoded,json} from "express";
import auth from './middle/auth.js'
const app = express()
app.use(cors())
app.use(urlencoded({extended: true}))
app.use(json())
app.use(auth)

import {register,findUserByName} from './data.js'


app.post("/login",(req,res) => {
    const {name,password} = req.body
    const user = findUserByName(name)
    console.log(user)
    if(!user){
        fail({res,msg:'用户不存在'})
        return}
    if(user.password !== password){
        fail({res,msg:'密码错误'})
    }
    const token = generateToken({name})
    console.log(token)
    ok({res,data:{token:token,name:name
            ,nickName:user.nickName}})
   })
app.post("/register",(req,res) => {
    const {name, password} = req.body
    if (findUserByName(name)) {
        fail({res, msg: '用户已存在'})
        return
    }
    register(name, password)
    ok({res, msg: '注册成功'})
    })

app.get("/userInfo",(req,res) => {

    const user = findUserByName(req.user.name)
    if (!user) {
        fail({res, msg: '用户不存在',code:401})
        return
    }
    delete user['password']
    ok({res,msg:'获取用户信息成功',data:user})
    })
export default app
