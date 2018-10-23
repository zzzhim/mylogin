<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-menu router :default-active="defaultActive" mode="horizontal" background-color="#545c6a" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="/login">登录</el-menu-item>
                    <el-menu-item index="/register">注册</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <el-main height="" class="bg-dark">
          <!-- Main content -->
              <el-row>
                <el-col :span="12" :offset="6">
                    <el-form ref="regform" :model="regForm" :rules="rules" :label-position="labelPosition" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input type="text" v-model="regForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="regForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPassword">
                            <el-input type="password" v-model="regForm.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="submitForm('regform')">注册</el-button>
                            <el-button type="primary" @click="resetForm('regform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script>
// 引入request发请求的axios实例
import request from '@/util/request'

export default {
  name: "Register",
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
    let validatorPass2 = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error("两次密码输入不一致,请重新输入"));
      } else {
        callback();
      }
    };
    return {
      // 当前切换的导航
      defaultActive: "/register",
      labelPosition: "right",
      // 绑定的数据
      regForm: {
        username: "",
        password: "",
        checkPassword: "",
        activeIndex: ""
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
        ],
        // 确认密码验证规则
        checkPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          // 自定义的验证规则
          { validator: validatorPass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证规则成功之后,在进行发送请求
          request({
            url: '/api/register',
            method: 'post',
            data: this.regForm
          }).then( ({ data }) => {
            console.log(data);
          }).catch( err => {
            console.log(err);
          })
        } else {
          // console.log('验证失败');
          return false;
        }
      });
    },
    // 重置表单数据
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.bg-dark {
  background-color: #f1f1f1;
}
</style>
