<template>
  <div class="login-container">
    <!-- model属性指定 form表单收集的数据放置到哪里， rules属性是el-form的属性表示对输入进行校验-->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!--
          注意 svg-icon自定义组件放置到了 el-input 标签的外部
          这种写法是不生效的：<el-input><svg-icon></svg-icon></el-input>
          因为自定义组件 el-input 标签中间的内容 会被分发到 组件内部定义的slot插槽中。
          如果el-input 组件内部没有 定义任何slot插槽，那么组件标签中间部分的代码将会被忽略。
        -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!--
        问题：为什么这个 @click要加prevent？
        官网的示例是：  <el-button type="primary" @click="onSubmit">立即创建</el-button>

        2. 在原生 form中  需要设置一个input type为submit的 提交按钮 ，这个按钮将会触发form表单的提交。而我们这里没有使用  type为submit的按钮，因此按钮点击不会触发原生
        form的submit。 form的提交需要我们自己粗合理
        <input type="submit" value="提交">
      -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >

      <div class="tips">
        <span style="margin-right: 20px">username: admin</span>
        <span> password: any</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  /**
   * 监听回调和组件更新谁先执行？
   *当你更改了响应式状态，它可能会同时触发  Vue  组件更新和侦听器回调。
   *默认情况下，用户创建的侦听器回调，都会在  Vue  组件更新 之前 被调用。这意味着你在侦听器回
   *调中访问的 DOM  将是被  Vue  更新之前的状态。
   *如果想在侦听器回调中能访问被 Vue  更新 之后 的DOM，你需要指明  选项：  flush:  'post'
   */
  watch: {
    /**
     *
     * 正常地址： http://localhost:9528/
     * 如果我们恶意访问一个不存在的地址 http://localhost:9528/ppp
     * 那么 就会变成： http://localhost:9528/pppp#/login?redirect=%2Fdashboard
     *
     * 首先  http://localhost:9528/ppp 会被当作  http://localhost:9528/ppp#/
     * 也就是访问 /， 根据路由规则配置 /会被重定向到 /dashboard
     *
     * 但是访问http://localhost:9528/#/ppp 就会被重定向到  http://localhost:9528/#/404
     *
     * 然后路由发生变化前执行这里的 beforeEach， from是/  to是/dashboard
     *
     * beforeEach的函数中 判断没有 token，且to的路径中不包含/login 因此
     * 执行  next(`/login?redirect=${to.path}`) 重定向到 /login
     *
     * 真正重定向之前 又会再次执行beforeEach， from是/  to是/login?redirect=xx
     * 本地没有token，且to的url中包含了login，因此next放行 。又因为 路由/login 指定了login.vue渲染，
     * 因此展示了登录页面。 此时地址栏的地址就是  http://localhost:9528/pppp#/login?redirect=%2Fdashboard
     *
     */
    $route: {
      //为什么要监听$route?
      handler: function (route) {
        //watch的函数接收两个参数，第一个是新值，第二个是旧值，这里我们使用一个参数接收新值
        console.log("监听到路由$route对象发生了变化");

        //监听这里的$route的本质就是获取  http://localhost:9528/appp#/login?redirect=%2Fdashboard
        //获取查询参数中的重定向地址
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true, //立即调用：在侦听开始时立即调用一次watch方法
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      console.log(this.$refs.password);
      console.log(this.$refs.password.$$attrs);
      this.$refs.password.focus();
      // 问题： 为什么这里要使用 nextTick
      /**
       * 原因时 el-input 这个标签使用了 :key="passwordType"
       * 在上面 我们修改了 password，这就导致 这个input的 key发生了变化， 比如 我们将 password由1改为2，  这个时候 Vue 还没有来得及渲染新的 key=2的input， 然后我们在这里使用了
       * this.$refs.password 实际上是获取到了 key=1的el-input，因此我们这里直接执行
       *  this.$refs.password.focus(); 实际上是针对key=1的input执行的。
       *
       * passwordType 变为2 导致vue 删除key=1的input，渲染key=2的input，因此我们需要使用nextTick 来获取渲染后的 key=2的el-input
       */
      this.$nextTick(() => {
        this.$refs.password.focus();
        console.log(this.$refs.password);
        console.log(this.$refs.password.$$attrs);
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          //发送请求，登录成功之后重定向到目标地址
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
