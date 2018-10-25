<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-menu router :default-active="defaultActive" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="/login">登录</el-menu-item>
                    <el-menu-item index="/register">注册</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <el-main height="" class="bg-dark">
          <!-- Main content -->
              <el-row>
                <el-col :span="12" :offset="6">
                    <el-form :model="loginForm" :rules="rules" ref="regForm" :label-position="labelPosition" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input type="text" v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="loginForm.password" ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="submitForm('regForm')">登录</el-button>
                            <el-button type="primary" @click="resetForm('regForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script>
    import request from '../util/request.js'

    export default {
      name: "Login",
      data() {
          let validatorPass = (rule, value, callback) => {
            // 密码必须是数字和字母的组合,而且长度必须在6-16位
            let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
            if (!reg.test(value)) {
              callback(new Error("密码长度需6-16位，且包含字母和字符"));
            } else {
              callback();
            }
          };
          return {
              defaultActive: '/login',
              labelPosition: 'right',
                              // 绑定的数据
              loginForm: {
                username: "",
                password: "",
              },
              // 表单验证规则
              rules: {
                // 用户名验证规则
                username: [
                  { required: true, message: "请输入用户名", trigger: "blur" },
                  {
                    min: 6,
                    max: 16,
                    message: "用户名必须在6-16位之间",
                    trigger: "blur"
                  }
                ],
                // 密码验证规则
                password: [
                  { required: true, message: "请输入密码", trigger: "blur" },
                  // 自定义的验证规则
                  { validator: validatorPass, trigger: "blur" }
                ]
              }
          }
      },
      methods: {
        // 重置表单数据
        resetForm: function(formName) {
          this.$refs[formName].resetFields();
        },
        submitForm: function(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 验证成功
              request({
                url: '/api/login',
                method: 'post',
                data: this.loginForm
              }).then(({data}) => {
                let { success, message, token, username } = data;
                if(success){
                  // 登录成功
                  // 1.把token存到cookies或者是sessionstorage/localstorage里面去,用户名也得存进去store
                  this.$store.dispatch('UserLogin', token)
                  this.$store.dispatch('UserName', username)
                  // 2.跳转到首页
                  this.$router.push('/');
                }else {
                  // 失败后给出错误提示
                  this.$message.success(message);
                }
              }).catch(err => {
                console.log(err);
              })
            }else {
              return false;
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">
    .bg-dark {
      background-color: #f1f1f1;
    }
</style>
