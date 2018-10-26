// 引入数据库连接文件
const db = require('../model/db')
//引入user集合
const User = require('../model/User')

const addForm = require('../model/addForm')

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
  // 获取前端发来的数据
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  // 查询数据库是否存在username用户
  let doc = await User.getUserByName(username);
  if (doc) {
    //说明数据库有重名的用户
    //1.判断数据库是否有同名的用户，如果存在则不允许注册
    //2.需要验证下数据的合法性 --- validator也可以不验证，
    //保险的话前端验完后端再验证
    //3.注册的时候通常需要对时间进行格式化
    //4.将注册用户的信息保存再数据库中
    //5.生成token，将成功的注册信息以及token返回给前n
    ctx.status = 200; // 设置状态码
    ctx.body = {  // 返回数据
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
      // 把数据存储到数据库中
      newUser.save((err, doc) => {
        if(err){
          reject(err) // 错误消息
        }
        resolve(doc) // 用户相关信息
      })
    })
    ctx.status = 200 // 设置状态码
    ctx.body = {  // 返回数据
      success: true,
      message: '注册成功',
      data: userInfo // 有些网站是注册后就直接登录了,所以,这里,把用户的信息也返回了,就是为了兼容那些注册后就直接登录的网站
    }
  }
}

const login = async ctx => {
  // 1.检查用户名是否存在
  // 2.检查密码是否正确
  // 3.生成token,将token返回给前端,用户登录后token就保留到了客户端了
  // 每次请求的时候我们都会让用户带着token来访问服务器,服务器呢,通过判断token,来确定用户是否是登录状态
  // 例如某些需要登录后才能访问的页面,就可以用这个实现权限管理了

  // 获取前端发来的数据
  let { username, password } = ctx.request.body

  // 查询数据库是否存在username用户
  let doc = await User.getUserByName(username)

  if(doc) {
    // 用户名存在
    if(doc.password === sha1(password)) {
      // 密码一样
      let token = createToken(username);
      // 赋值给doc新的token值
      doc.token = token;

      await new Promise((resolve, reject) => {
        doc.save((err, doc) => {
          if(err){
            reject(err)
          }else {
            resolve(doc)
          }
        })
      })

      ctx.status = 200
      ctx.body = {
        success: true,
        message: '登录成功',
        token: doc.token, // 用户的token信息
        username: doc.username // 登录的用户名
        // 如果有头像的话,也可以将用户的头像信息返回
      }
    }else {
      // 密码不一样
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '密码错误,请重新输入'
      }
    }
  }else {
    // 用户名不存在
    ctx.status = 200
    ctx.body = {
      success: false,
      message: '用户名不存在'
    }
  }

}
// 首页业务逻辑
const home = async ctx => {
  ctx.body = '你要的是不是这个'
}

// 添加
const addForms = async ctx => {
  let { username, name, password, phone, email, is_active } = ctx.request.body;
  let doc = await addForm.getUserByName(username);
  if(!doc){
    password = sha1(password)
    // console.log(password);
    let date = new Date();
    let create_time = moment(date).format('YYYY-MM-DD HH:mm:ss') // 当前时间就被格式化为年月日、时分秒了
    let newUser = new addForm({
      username,
      name,
      password,
      phone,
      email,
      is_active,
      create_time
    })

    let userInfo = await new Promise((resolve, reject) => {
      // 把数据存储到数据库中
      newUser.save((err, doc) => {
        if (err) {
          reject(err) // 错误消息
        }
        resolve(doc) // 用户相关信息
      })
    })

    ctx.status = 200 // 设置状态码
    ctx.body = {  // 返回数据
      success: true,
      message: '注册成功',
      data: userInfo
    }
  }else {
    ctx.status = 200
    ctx.body = {
      success: false,
      message: '用户名不允许重复'
    }
  }
}

const allUsers = async ctx => {
    // 所有数据
    const allUser = await new Promise((resolve, reject) => {
      addForm.find({},(err, data) => {
        if(err){
          reject(err)
        }
        resolve(data)
      })
    })
  ctx.status = 200
  ctx.body = allUser
}

const deletForm = async ctx => { // 删除单个数据
  let username  = ctx.request.body.username

  // addForm.remove({ username : username }).then(data => {
  //   console.log(data);
  // })
  // 删除单个数据
  const allUser = await new Promise((resolve, reject) => {
    addForm.remove({ username }, (err) => {
      if (err) {
        reject(err)
      }else {
        resolve(true)
      }
    })
  })

  if (allUser) {
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '删除成功了'
    }
  }else {
    ctx.status = 200
    ctx.body = {
      success: false,
      message: '删除失败了'
    }
  }
}

const updataForm = async ctx => { // 修改数据

  let { username, name, phone, email, is_active } = ctx.request.body
  // 修改
  const updata = await new Promise((resolve, reject) => {
    addForm.update({ username }, { name, phone, email, is_active }, (err, raw) => {
      if (err) {
        reject(err);
      } else {
        resolve(raw);
      }
    })
  })
  if (updata) {
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '修改成功了'
    }
  }else {
    ctx.status = 200
    ctx.body = {
      success: false,
      message: '修改失败了'
    }
  }
}

const deletAll = async ctx => {
  let username = ctx.request.body.username

  username.forEach(element => {
    addForm.remove({ username }).then(data => {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '删除成功了'
      }
    }).catch(err => {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: '删除失败了了'
      }
    })
  });
}

module.exports = {
  register,
  login,
  home,
  addForms,
  allUsers,
  deletForm,
  updataForm,
  deletAll
}
