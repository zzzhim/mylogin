const koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const server = require('koa-static');

const app = new koa()
const router = new Router()

// 引入子路由
const subRouter = require('./routes/index')

// 所有的/api请求都会到 ./routes/index 里面去处理
router.use('/api', subRouter.routes(), subRouter.allowedMethods());

app.use(bodyParser())

app.use(router.routes(), router.allowedMethods())
app.use(server('./statics'));

app.listen(3000, () => {
  console.log('服务器运行存在localhost:3000端口');
})
