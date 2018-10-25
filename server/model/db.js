// 引入mongoose
const mongoose = require('mongoose')
// 连接mongodb中的mylogin数据库
mongoose.connect('mongodb://localhost/mylogin')

const db = mongoose.connection

// 声明我们使用的Promise是ES6里面的Promise对象
mongoose.Promise = global.Promise

// 连接失败时触发
db.on('error', function () {
  console.log('数据库连接失败');
})
// 连接成功时触发
db.on('open', function () {
  console.log('数据库连接成功');
})
