import express from 'express'
import cors from 'cors'
import { json, urlencoded } from 'express'
import multer from 'multer'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import auth from './middle/auth.js'
import { ok, fail, generateToken } from './util.js'
import uuid from 'uuid'
import {
  register,
  findUserByName,
  storageAll,
  categoryList,
  delCategory,
  addCategory,
  updateCategory,
  getArticleList,
  delArticle,
  addArticle,
  updateArticle,
  getArticleDetail,
  getMaxId
} from './data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, 'uploads')

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const safeOriginalName = path.basename(file.originalname).replace(/\s+/g, '-')
    cb(null, `${randomUUID()}-${safeOriginalName}`)
  }
})

const upload = multer({ storage })
const app = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use('/uploads', express.static(uploadDir))
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

app.post('/addArticle', (req, res) => {
  const data = req.body
  data.id = getMaxId() + 1
  data.pub_date = new Date().toLocaleString()
  addArticle(data)
  ok({ res, msg: '添加成功' })
})

app.post('/updateArticle', (req, res) => {
  const data = req.body

  if (!data.id) {
    fail({ res, msg: 'id不能为空' })
    return
  }

  updateArticle(data)
  ok({ res, msg: '更新成功' })
})

app.get('/articleDetail', (req, res) => {
  const { id } = req.query
  const result = getArticleDetail(id)
  ok({ res, msg: '获取文章详情成功', data: result })
})

app.post('/upload', upload.any(), (req, res) => {
  const file = req.files?.[0]

  if (!file) {
    fail({ res, msg: '上传失败' })
    return
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`

  ok({
    res,
    msg: '上传成功',
    data: {
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname
    }
  })
})

export default app
