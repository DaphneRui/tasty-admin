<template>
  <div class="login">
    <!-- 登录信息 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      label-width="100px"
      class="login-form"
    >
      <!-- 用户名 -->
      <el-form-item
        label="用户名:"
        prop="username"
      >
        <el-input
          v-model="loginForm.username"
          type="text"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item
        label="密码:"
        prop="password"
      >
        <el-input
          v-model="loginForm.password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item class="login-button">
        <!-- 登录 -->
        <el-button
          type="primary"
          @click="toLogin"
        >
          登录
        </el-button>

        <el-button @click="drawer = true">
          显示
        </el-button>
        <!-- 登录提示 -->
        <el-drawer
          :visible.sync="drawer"
          direction="rtl"
        >
          <template slot="title">
            <span :style="{fontSize: '16px'}">可选用户名</span>
          </template>

          <el-card
            v-for=" item in loginMsg"
            :key="item.id"
            class="box-card login-card"
            shadow="always"
          >
            <p>{{ item.identity }}</p>
            <p>username: {{ item.username }}</p>
            <p>password: {{ item.password }}</p>
          </el-card>
        </el-drawer>
      </el-form-item>
    </el-form>

    <!-- 登录按钮 -->
    <div class="login-button">
    </div>
  </div>
</template>

<script>
import './login.scss';
import { v4 as uuidv4 } from 'uuid';
import { mapActions } from 'vuex';
import _ from 'lodash';
export default {
   name: 'Login',
   data (){
      return{
         form: {},
         loginForm: {
            username: '',
            password: ''
         },
         rules: {
            username: [
               { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            password: [
               { required: true, message: '请输入密码', trigger: 'blur' }
            ],
         },
         drawer: false,
         loginMsg: [
            { identity: '管理员', username: 'admin', password: '随意', id: uuidv4() },
            { identity: '部门员工', username: 'employee', password: '随意', id: uuidv4() },
            { identity: '游客', username: 'visitor', password: '随意', id: uuidv4() }
         ]
      };
   },
   methods: {
      ...mapActions([
         'login',
      ]),

      /* 登录 */
      toLogin (){
         const availableName = [ 'admin','employee','visitor' ];
         if(_.includes(availableName, this.loginForm.username)){
            if(this.loginForm.password){
               this.login({
                  username: this.loginForm.username,
                  password: this.loginForm.password
               });
            }else{
               this.$message.error('Please type in correct password.');
            }
         }else{
            this.$message.error('Please type in correct username.');
         }

      }

   },
};
</script>

<style>

</style>