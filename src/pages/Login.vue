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
                    <el-form ref="regForm" :label-position="labelPosition" label-width="80px">
                        <el-form-item label="用户名" name="username">
                            <el-input type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" name="password1">
                            <el-input type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success">登录</el-button>
                            <el-button type="primary">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                defaultActive: '/login',
                labelPosition: 'right'
            }
        }
    }
</script>

<style scoped lang="scss">
    .bg-dark {
      background-color: #f1f1f1;
    }
</style>
