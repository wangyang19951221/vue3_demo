import express from 'express'
import cors from 'cors'
import { json, urlencoded } from 'express'

import auth from './middle/auth.js'
import { ok, fail, generateToken } from './util.js'
import {
  register,
  findUserByName,
  storageAll,
  categoryList,
  delCategory,
  addCategory,
  updateCategory,
  getArticleList,
  delArticle
} from './data.js'

const app = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(auth)

app.post('/login', (req, res) => {
  const { name, password } = req.body
  const user = findUserByName(name)

  if (!user) {
    fail({ res, msg: '用户不存在' })
    return
  }

  if (user.password !== password) {
    fail({ res, msg: '密码错误' })
    return
  }

  const token = generateToken({ name })
  ok({
    res,
    data: {
      token,
      name,
      nickName: user.nickName
    }
  })
})

app.post('/register', (req, res) => {
  const { name, password } = req.body

  if (findUserByName(name)) {
    fail({ res, msg: '用户已存在' })
    return
  }

  register(name, password)
  ok({ res, msg: '注册成功' })
})

app.get('/userInfo', (req, res) => {
  const user = findUserByName(req.user.name)

  if (!user) {
    fail({ res, msg: '用户不存在', code: 401 })
    return
  }

  const userInfo = { ...user }
  delete userInfo.password

  ok({ res, msg: '获取用户信息成功', data: userInfo })
})

app.post('/resetPassword', (req, res) => {
  const { new_pwd, old_pwd } = req.body
  const user = findUserByName(req.user.name)

  if (!user) {
    fail({ res, msg: '用户不存在' })
    return
  }

  if (user.password !== old_pwd) {
    fail({ res, msg: '原密码错误' })
    return
  }

  user.password = new_pwd
  storageAll()
  ok({ res, msg: '重置密码成功' })
})

app.post('/updateUserInfo', (req, res) => {
  const { nickname, email } = req.body
  const user = findUserByName(req.user.name)

  if (!user) {
    fail({ res, msg: '用户不存在' })
    return
  }

  user.nickname = nickname
  user.email = email
  storageAll()

  ok({ res, msg: '修改成功' })
})

app.get('/categoryList', (req, res) => {
  ok({ res, msg: '获取分类列表成功', data: categoryList })
})

app.post('/delCategory', (req, res) => {
  const { id } = req.body
  const deleted = delCategory(id)

  if (!deleted) {
    fail({ res, msg: '分类不存在' })
    return
  }

  ok({ res, msg: '删除成功' })
})

app.post('/addCategory', (req, res) => {
  const { cate_name, cate_alias } = req.body
  addCategory(cate_name, cate_alias)
  ok({ res, msg: '添加成功' })
})

app.post('/updateCategory', (req, res) => {
  const { id, cate_name, cate_alias } = req.body
  const updated = updateCategory(id, cate_name, cate_alias)

  if (!updated) {
    fail({ res, msg: '分类不存在' })
    return
  }

  ok({ res, msg: '更新成功' })
})

app.get('/articleList', (req, res) => {
  const result = getArticleList(req.query)
  ok({ res, msg: '获取文章列表成功', data: result })
})

app.post('/delArticle', (req, res) => {
  const { id } = req.body
  const deleted = delArticle(id)

  if (!deleted) {
    fail({ res, msg: '文章不存在' })
    return
  }

  ok({ res, msg: '删除文章成功' })
})

export default app
