import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getRandomAvatar } from './util.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const usersFile = path.join(__dirname, 'users.json')

class User {
  constructor(name, password) {
    this.name = name
    this.password = password
    this.nickname = `nickXXX${name}`
    this.avatar = getRandomAvatar()
  }
}

const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8')) || []

export const register = (name, password) => {
  users.push(new User(name, password))
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

export const findUserByName = (name) => users.find((user) => user.name === name)

export const storageAll = () => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

export const categoryList = [
  { id: 10001, cate_name: '前端', cate_alias: 'front' },
  { id: 10002, cate_name: '后端', cate_alias: 'back' },
  { id: 10003, cate_name: '数据库', cate_alias: 'db' },
  { id: 10004, cate_name: '移动端', cate_alias: 'mobile' },
  { id: 10005, cate_name: '其他', cate_alias: 'other' }
]

const getCategoryName = (cateId) =>
  categoryList.find((item) => item.id === cateId)?.cate_name || '未分类'

export const articleList = [
  {
    id: 20001,
    title: 'Vue 3 组合式 API 入门',
    cate_id: 10001,
    cate_name: getCategoryName(10001),
    pub_date: '2026-04-21 09:00:00',
    state: '已发布'
  },
  {
    id: 20002,
    title: 'Pinia 状态管理实践',
    cate_id: 10001,
    cate_name: getCategoryName(10001),
    pub_date: '2026-04-20 15:30:00',
    state: '草稿'
  },
  {
    id: 20003,
    title: 'Node.js 接口设计规范',
    cate_id: 10002,
    cate_name: getCategoryName(10002),
    pub_date: '2026-04-19 11:20:00',
    state: '已发布'
  },
  {
    id: 20004,
    title: 'Express 中间件拆分思路',
    cate_id: 10002,
    cate_name: getCategoryName(10002),
    pub_date: '2026-04-18 18:10:00',
    state: '草稿'
  },
  {
    id: 20005,
    title: 'MySQL 索引优化笔记',
    cate_id: 10003,
    cate_name: getCategoryName(10003),
    pub_date: '2026-04-17 08:40:00',
    state: '已发布'
  },
  {
    id: 20006,
    title: '移动端适配方案总结',
    cate_id: 10004,
    cate_name: getCategoryName(10004),
    pub_date: '2026-04-16 21:15:00',
    state: '已发布'
  },
  {
    id: 20007,
    title: '前端工程化常见问题',
    cate_id: 10001,
    cate_name: getCategoryName(10001),
    pub_date: '2026-04-15 10:00:00',
    state: '草稿'
  },
  {
    id: 20008,
    title: '接口鉴权与 Token 流程',
    cate_id: 10002,
    cate_name: getCategoryName(10002),
    pub_date: '2026-04-14 13:45:00',
    state: '已发布'
  },
  {
    id: 20009,
    title: '数据库设计避坑清单',
    cate_id: 10003,
    cate_name: getCategoryName(10003),
    pub_date: '2026-04-13 17:05:00',
    state: '草稿'
  },
  {
    id: 20010,
    title: '团队协作中的代码规范',
    cate_id: 10005,
    cate_name: getCategoryName(10005),
    pub_date: '2026-04-12 09:50:00',
    state: '已发布'
  }
]

export const delCategory = (id) => {
  const index = categoryList.findIndex((item) => String(item.id) === String(id))
  if (index === -1) return false
  categoryList.splice(index, 1)
  return true
}

export const addCategory = (cate_name, cate_alias) => {
  const nextId = categoryList.length
    ? categoryList[categoryList.length - 1].id + 1
    : 10001
  categoryList.push({ id: nextId, cate_name, cate_alias })
}

export const updateCategory = (id, cate_name, cate_alias) => {
  const category = categoryList.find((item) => String(item.id) === String(id))
  if (!category) return false
  category.cate_name = cate_name
  category.cate_alias = cate_alias
  articleList.forEach((article) => {
    if (String(article.cate_id) === String(id)) {
      article.cate_name = cate_name
    }
  })
  return true
}

export const getArticleList = ({ pagenum = 1, pagesize = 5, cate_id = '', state = '' } = {}) => {
  const pageNum = Number(pagenum) || 1
  const pageSize = Number(pagesize) || 5

  const filteredList = articleList
    .filter((article) => {
      const matchCate = cate_id === '' || String(article.cate_id) === String(cate_id)
      const matchState = state === '' || article.state === state
      return matchCate && matchState
    })
    .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())

  const total = filteredList.length
  const start = (pageNum - 1) * pageSize
  const data = filteredList.slice(start, start + pageSize)

  return {
    total,
    data
  }
}

export const delArticle = (id) => {
  const index = articleList.findIndex((item) => String(item.id) === String(id))
  if (index === -1) return false
  articleList.splice(index, 1)
  return true
}
