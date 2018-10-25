<template>
    <div>
      <el-container>
          <el-header height="" class="header">
            <!-- Header content -->
            <h1 class="text-center">Vue + Node增删改查</h1>
          </el-header>
          <el-main height="">
            <!-- Main content -->
            <el-row>
              <el-col :span="8" :offset="13">
                <div class="text-right">
                  <el-button type="primary" @click="" icon="el-icon-plus" class="button" @click="bool=true">添加</el-button>
                  <el-button type="danger" @click="" icon="el-icon-delete" class="button">删除</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                    <el-table :data="tableData" style="width: 100%">
                      <el-table-column type="selection" width="55">

                      </el-table-column>
                      <el-table-column prop="username" label="用户名" width="140">
                      </el-table-column>
                      <el-table-column prop="name" label="姓名" width="140" sortable>
                      </el-table-column>
                        <el-table-column prop="phone" label="手机" width="180">
                      </el-table-column>
                      <el-table-column prop="email"  label="邮箱" width="200">
                      </el-table-column>
                      <el-table-column  prop="create_time" label="注册日期" width="400" sortable>
                      </el-table-column>
                      <el-table-column prop="is_active" label="状态" width="200">
                        <template slot-scope="scope">
                          <el-tag :type="scope.row.is_active==true?'success':'danger'">
                            {{scope.row.is_active==true?'启用':'停用'}}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                          <el-button type="success" size="small" @click="">编辑</el-button>
                          <el-button type="danger" size="small" @click="deletForm(scope.row.username)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
              </el-col>
            </el-row>
            <!-- 动画 -->
            <transition name="el-fade-in-linear">
              <div v-show="bool" class="transition-box">
                <el-container>
                  <!-- 遮罩 -->
                  <!-- <div class="shade"></div> -->
                  <div class="popups">
                    <h1 class="title">添加新用户</h1>
                    <el-form :label-position="'right'" :rules="addRules" label-width="80px" :model="addForm" ref="addForm">
                      <el-form-item label="用户名" prop="username">
                          <el-input type="text" v-model="addForm.username"></el-input>
                      </el-form-item>
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                      </el-form-item>
                      <el-form-item label="确认密码" prop="repeat_password">
                        <el-input v-model="addForm.repeat_password"></el-input>
                      </el-form-item>
                      <el-form-item label="手机" prop="phone">
                        <el-input v-model="addForm.phone"></el-input>
                      </el-form-item>
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                      </el-form-item>
                      <el-form-item label="是否启用">
                        <el-switch v-model="addForm.is_active"></el-switch>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
                        <el-button type="danger"  @click="resetForm('addForm')">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-container>
              </div>
            </transition>
          </el-main>
      </el-container>
    </div>
</template>

<script>
    import request from '../util/request.js'

    export default {
      name: 'Home',
      // 组件挂在完毕的时候发个请求,请求服务器的数据
      data() {
        let checkPass = (rule, value, callback) => {
          // 密码必须是数字和字母的组合,而且长度必须在6-16位
          let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
          if (!reg.test(value)) {
            callback(new Error("密码长度需6-16位，且包含字母和字符"));
          } else {
            callback();
          }
        };
        let repeat_checkPass = (rule, value, callback) => {
          if (value !== this.addForm.password) {
            callback(new Error("两次密码输入不一致,请重新输入"));
          } else {
            callback();
          }
        };
        let addEmail = (rule, value, callback) => {
          // 必须是合法邮箱格式
          let reg = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
          if (!reg.test(value)) {
            callback(new Error("必须是合法邮箱格式"));
          } else {
            callback();
          }
        };
        let addPhone = (rule, value, callback) => {
          // 您输入的手机号码不是有效的格式
          let reg = /(13[0-9]|147|15[012356789]|18[0256789])[0-9]{8}/;
          if (!reg.test(value)) {
            callback(new Error("您输入的手机号码不是有效的格式"));
          } else {
            callback();
          }
        };
        return {
          bool: false,
          tableData: [],
          addForm: {
            username: '', //用户名
            name: '', //姓名
            password: '', //密码
            repeat_password: '', //确认密码
            phone: '', //电话
            email: '', //邮箱
            is_active: true //状态
          },
          // 添加用户校验
          addRules: {
            username:[
              {required:true,message:'请输入用户名',tigger:'blur'},
              {min:3,max:16,message:'请输入合法的用户名',tigger:'blur'}
            ],
            name:[
              {required:true,message:'请输入姓名',tigger:'blur'},
            ],
            password:[
              {required:true,message:'请输入密码',tigger:'blur'},
              {min:6, max:12 ,message:'密码长度不合法', tigger:'blur'},
              {validator:checkPass, tigger:'blur'}
            ],
            repeat_password:[
              {required:true,message:'确认请输入密码',tigger:'blur'},
              {validator:repeat_checkPass, tigger:'blur'}
            ],
            phone:[
              {required:true,message:'请输入手机号码',tigger:'blur'},
              {validator:addPhone, tigger:'blur'}
            ],
            email:[
              {required:true,message:'请输入邮箱',tigger:'blur'},
              {validator:addEmail, tigger:'blur'}
            ]
          },
        }
      },
      methods: {
        resetForm(formName) { // 重置表单
          this.$refs[formName].resetFields()
          this.bool = false
        },
        submitForm(formName) { // 提交表单
          // console.log(this.addForm);
          // 校验用户是否全部填写
          this.$refs[formName].validate((valid) => {
            if(valid) {
              request({
                url: '/api/addForm',
                method: 'post',
                data: this.addForm
              }).then( ({ data }) => {
                // let { username, create_time, name, phone, email, is_active } = data.data
                // this.tableData.push({
                //   username,
                //   name,
                //   create_time,
                //   phone,
                //   email,
                //   is_active
                // })
                this.getUsers()
                this.$refs[formName].resetFields()
              })
              this.bool = false
            }
          })
        },
        getUsers() { // 获取全部数据
          request({
            url: '/api/allUsers',
            method: 'get'
          }).then(({ data }) => {
            this.tableData = data
          })
        },
        deletForm(ele) { // 删除单个数据
          request({
            url: '/api/deletForm',
            method: 'delete',
            data: {
              username: ele
            }
          }).then(({ data }) => {
            // console.log(data);
            if(data.success) {
              this.$message.success(data.message);
              this.getUsers()
            }else {
              this.$message.success(data.message);
            }
          })
        }
      },
      mounted() {
        request({
          url: '/api/home',
          method: 'get'
        }).then(({ data }) => {
          this.$message.success('恭喜你成功登录了');
        })
        this.getUsers()
      },
    }
</script>

<style scoped type="scss">
  .header {
    margin: 20px 0px;
  }
  .button {
    padding: 8px 10px;
  }
  /* .shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  } */
  .popups {
    width: 800px;
    height: 600px;
    padding: 20px;
    background-color: #fff;
    z-index: 100;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: auto;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
  }
  .title {
    margin-bottom: 40px;
  }
</style>
