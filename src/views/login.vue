<template>
  <div class="login">
    <div class="user-login">
      <div class="form-title">高顿教育教务系统</div>
      <div class="login-box">
        <div class="form-item">
          <label for="userName">用户名：</label>
          <input v-model="form.name" id="userName" type="text" placeholder="">
        </div>
        <div class="form-item">
          <label for="password">密码：</label>
          <input v-model="form.password" id="password" type="password" placeholder="">
        </div>
        <div class="form-item">
          <el-button class="login-btn" type="warning" @click="login">登陆</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as _axios from '../assets/javascript/http'
import storage from 'good-storage'

export default {
  name: 'login',
  data () {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  computed: {},
  mounted () {
    this.$nextTick(() => {
      this.setSize()
      window.addEventListener('resize', this.setSize)
      window.addEventListener('keyup', event => {
        if (event.keyCode === 13 && this.$route.name === 'login') {
          this.login()
        }
      })
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setSize)
  },
  methods: {
    login () {
      _axios.fetchPost('/admin/v1/login', {
        account: this.form.name,
        password: this.form.password
      }).then(res => {
        if (res.data.code === 200) {
          this.$router.push({ name: 'schedule' });
          storage.set('_token_', res.data.data.token);
          this.$store.state._token_ = res.data.data.token;
          Vue.prototype.token = storage.get('_token_');
        }
      }).catch(err => {
        throw err
      })
    },
    setSize () {
      let w = window.innerWidth
      let h = window.innerHeight
      let login = document.getElementsByClassName('login')[0]
      login.style.width = w + 'px'
      login.style.height = h + 'px'
    },
  },
  components: {}
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss_mixin/css3_animate";

  .login {
    position: relative;
    width: 100%;
    background: url('../assets/images/cloud.png') 0 bottom repeat-x #049ec4;
    animation: animate-cloud 20s linear infinite;
    text-align: center;

    .form-title {
      margin-bottom: 50px;
      text-align: center;
      font-size: 24px;
      line-height: 1.5;
      color: #fff;
    }

    .user-login {
      position: relative;
      width: 500px;
      height: auto;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80%);

      .form-item {
        position: relative;
        padding-left: 80px;
        margin-bottom: 24px;

        label {
          display: block;
          width: 70px;
          padding-right: 10px;
          position: absolute;
          left: 0;
          top: 0;
          height: 40px;
          line-height: 40px;
          color: #fff;
          text-align: right;
        }

        input {
          display: block;
          width: 100%;
          height: 40px;
          padding: 0;
          text-indent: 1em;
        }
      }

      .login-btn {
        width: 100%;
      }
    }
  }

  @include animate-cloud

</style>
