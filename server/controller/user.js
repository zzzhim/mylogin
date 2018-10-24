// 引入数据库连接文件
const db = require('../model/db')
//引入user集合
const User = require('../model/User')
// 引入密码加密模块
const sha1 = require('sha1')
// 引入日期格式化模块
const moment = require('moment')
// 引入创建token的方法
const createToken = require('../token/createToken')

//处理post请求/reigster的处理函数
//因为这个处理函数需要将用户名，密码写入数据库，所以额，我们需要在
//数据库中创建user集合
//通过controller/user.js这个文件,来对数据库进行增删改查
const register = async ctx => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let doc = await User.getUserByName(username);
  if (doc) {
    //说明数据库有重名的用户
    //1.判断数据库是否有同名的用户，如果存在则不允许注册
    //2.需要验证下数据的合法性 --- validator也可以不验证，
    //保险的话前端验完后端再验证
    //3.注册的时候通常需要对时间进行格式化
    //4.将注册用户的信息保存再数据库中
    //5.生成token，将成功的注册信息以及token返回给前n
    ctx.status = 200;
    ctx.body = {
      success: false,
      message: '用户名不允许重复'
    }
  } else {
    //说明数据库没有重名的用户
    //可以放心注册了
    //这里一般为了安全 还会用username，password进行验证
    //为了节省时间，就不验证了，可以利用nodeli面的一个模块
    //可以很方便的进行验证  --validator 模块
    // 也可以使用crypto模块-node原生的加密模块进行加密
    password = sha1(password)
    // console.log(password);
    let date = new Date();
    let create_time = moment(date).format('YYYY-MM-DD HH:mm:ss') // 当前时间就被格式化为年月日、时分秒了
    // 生成token
    let token = createToken(username)
    // 创建新用户
    let newUser = new User({
      username,
      password,
      token,
      create_time
    })
    // 将新用户保存到User集合里面
    let userInfo = await new Promise((resolve, reject) => {
      newUser.save((err, doc) => {
        if(err){
          reject(err)
        }
        resolve(doc)
      })
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '注册成功',
      data: userInfo
    }
  }
}

module.exports = {
  register
}
