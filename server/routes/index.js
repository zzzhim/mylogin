const Router = require('koa-router')
const subRouter = new Router()

const UserController = require('../controller/user')
// 服务器判断token是否合法
const checkToken = require('../token/checkToken')

subRouter.post('/register', UserController.register)
subRouter.post('/login', UserController.login)
// 他有没有权限让服务器给它返回数据
// 如果以后有哪些请求需要登录后才可以得到数据,在路由中加上checkToken
subRouter.get('/home', checkToken, UserController.home)
subRouter.post('/addForm', checkToken, UserController.addForms)

subRouter.get('/allUsers', checkToken, UserController.allUsers)
subRouter.delete('/deletForm', checkToken, UserController.deletForm)

subRouter.post('/updataForm', checkToken, UserController.updataForm)

module.exports = subRouter
