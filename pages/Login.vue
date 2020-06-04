<template>
  <div class="background">
    <div class="mask">
      <img src="./img/logoImg.png" id="logo" style=""/>
      <img src="./img/logoTitle.png" id="logoImg" />
      <div class="content">
        <h3 style="text-align: center;color:#fff;font-size:48px;">中南大学商学院信息管理系统</h3>
        <el-form
          :model="formLabelAlign"
          class="card-box loginForm"
        >
          <el-form-item style="text-align: center;">
            <el-input
              v-model="formLabelAlign.username"
              clearable
              prefix-icon="el-icon-user"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-input
              id="passInput"
              v-model="formLabelAlign.password"
              type="password"
              clearable
              prefix-icon="el-icon-view"
              size="large"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button type="primary" @click="login" :loading="loading" id="login">登 录</el-button>
          </el-form-item>
          <h3 class="rule cnrule">天道酬勤，经世致用</h3>
          <h3 class="rule">Fortune favors the diligent, Knowledge serves the society.</h3>
        </el-form>
        <h3 class="message">版权所有 ©2020 中南大学商学院|由长沙才盛优创信息技术有限公司制作</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
export default {
  data() {
    return {
      loading: false,
      formLabelAlign: {}
    };
  },
  methods: {
    async login() {
      let res = await axios.$post("/ajaxlogin", this.formLabelAlign);
      if (res.code == 401) {
        this.$message({
          type: "error",
          message: "账户被冻结"
        });
      }
      let stoage = window.localStorage;
      stoage.setItem("userInfo", res.data);
      stoage.setItem("message", res.message);
      stoage.setItem("userId", res.data.id);
      stoage.setItem("userInfo", JSON.stringify(res.data));
      stoage.setItem("roleId", res.data.roleid);
      this.$store.commit("setToken", res.message);
      let roles = await axios.$get("/menu/checkedMenuListByRoleId", {
        roleId: res.data.roleid
      });
      stoage.setItem("roles", JSON.stringify(roles.data));
      location.href = "/shangxueyuan_admin";
    }
  },
};
</script>

<style scoped>
#logo {
  margin-top: 2%;
  margin-left: 2%;
}

#logoImg {
  margin-top: 2%;
  margin-left: 2%;
}
.background {
  background-image: url("./img/bg1.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  height: 100vh;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0,0,0,0.5);
}
.content {
  margin-top: 30px;
}
.loginForm {
  width: 700px;
  margin: 20px auto;
}
.title {
  font-size: 48px;
  color: #ffffff;
  text-align: center;
  /* position: absolute;
  top:100px;
  left: -200px; */
}

.cnrule {
  margin-top: 4%;
}
.rule {
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
}
.message {
  font-size: 18px;
  color: #ffffff;
  width: 100%;
  position: absolute;
  top: 95%;
  text-align: center;
  font-weight: bold;
}
.el-input {
  width: 400px;
}
.el-button {
  width: 400px;
}
.el-input__inner {
  border: 1px;
  background: rgba(0, 0, 0, 0);
}
</style>
