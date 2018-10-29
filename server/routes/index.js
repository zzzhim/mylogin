const Router = require('koa-router')
const subRouter = new Router()

const UserController = require('../controller/user')
// 服务器判断token是否合法
const checkToken = require('../token/checkToken')


// 他有没有权限让服务器给它返回数据
// 如果以后有哪些请求需要登录后才可以得到数据,在路由中加上checkToken

// 请求
subRouter.get('/home', checkToken, UserController.home)
// 修改
subRouter.post('/allUsers', checkToken, UserController.allUsers)
subRouter.post('/register', UserController.register)
subRouter.post('/login', UserController.login)
subRouter.post('/addForm', checkToken, UserController.addForms)
subRouter.post('/updataForm', checkToken, UserController.updataForm)
subRouter.post('/HomeImg', checkToken, UserController.HomeImg)
// subRouter.post('/homes', checkToken, UserController.homes)


// 删除
subRouter.delete('/deletForm', checkToken, UserController.deletForm)
subRouter.delete('/deletAll', checkToken, UserController.deletAll)



module.exports = subRouter
