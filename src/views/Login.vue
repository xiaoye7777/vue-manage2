<template>
  <div>
    <el-form ref="form" label-width="70px" inline :model="form" :rules="rules" class="login-container">
      <h3 class="login_title">系统登陆</h3>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="login-btn">
        <el-button @click="submit" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Mock from 'mockjs'
import Cookie from 'js-cookie'
import { getMenu } from '../api'


export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ]
      }
    }
  },
  methods: {
    //登录
    submit() {
      // const token = Mock.Random.guid()  //token
      // Cookie.set('token',token)  //将token存入cookie用于不同页面间的通信
      // this.$router.push('home') //跳转到首页 ？？这一步的逻辑
      //现在要用mock模拟的token了，这个👆随机生成的就用不着了

      //填写了内容再去调用接口
      this.$refs.form.validate((valid) => {
        if (valid) {
          getMenu(this.form).then(({ data }) => {
            console.log('data2222222', data)
            if (data.code === 20000) {
              //把data里的token存入cookie
              Cookie.set('token', data.data.token)
              this.$message({
                message: '登录成功',
                type: 'success'
              });

              //把拿到的路由存入store里
              
              this.$store.commit('SETMANU', data.data.menu)
              this.$store.commit('ADDMENU', this.$router)
              
            

              //跳转到首页
              this.$router.push('home')
            } else {
              this.$message.error(data.data.message)
            }

          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  box-sizing: border-box;
  width: 350px;
  //border: 1px solid;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 25px #cac6c6;

  .login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458
  }

  .el-input {
    width: 198px;
  }

  .login-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>