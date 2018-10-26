const mongoose = require('mongoose');
//创建我们的数据库集合的架构
//这里面，指定集合里面的字段名称和字段的类型
const UserSchema = new mongoose.Schema({
  //常用的数据类型
  //1.string
  //2.number
  //3.Date
  //4.Boolean
  //5.ObjectID
  //6.Array
  username: String,
  name: String,
  password: String,
  phone: String,
  email: String,
  is_active: Boolean,
  create_time: String
})
//可以添加一些自定义的实例方法
UserSchema.statics = {
  getUserByName: function (username) { // 查询数据是否存在
    return new Promise((resolve, reject) => {
      User.findOne({ username }, (err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  },
  getCouns() {
    return new Promise((resolve, reject) => { // 查询数据库中文档总数
      User.count({}, (err, count) => {
        if (err) {
          reject(err);
        }
        resolve(count);
      })
    })
  },
  updateForm(username, parameter) { // 修改数据
    return new Promise((resolve, reject) => {
      User.update(username, parameter, (err, raw) => {
        if (err) {
          reject(err);
        } else {
          resolve(raw);
        }
      })
    })
  },
  removeUserName(username) { // 删除数据
    return new Promise((resolve, reject) => {
      User.remove(username, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}

//生成模型，说白了就是创建一个集合
//第一个参数是模型的名字 ，集合的名字
//第二个参数是集合使用的架构
const User = mongoose.model('addFrom', UserSchema);
//暴漏一个集合
module.exports = User;

