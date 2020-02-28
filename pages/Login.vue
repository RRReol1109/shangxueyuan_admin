<template>
  <div class="background">
    <el-form
      label-position="left"
      label-width="0px"
      :model="formLabelAlign"
      class="card-box loginForm"
    >
      <h3 class="title">中南大学商学院信息管理系统登录</h3>
      <el-form-item>
        <el-input
          v-model="formLabelAlign.username"
          clearable
          prefix-icon="el-icon-mobile-phone"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="login" :loading="loading">登 录</el-button>
      </el-form-item>
    </el-form>
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
      let res = await this.$axios.$post("/ajaxlogin", this.formLabelAlign);
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
      console.log(res.roleid);
      console.log(roles, "==========roles");
      console.log(res);
    }
  }
};
</script>

<style scoped>
.background {
  background-color: #303e47;
  background-image: url(//oem.faisys.com/image/demo2.png);
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  height: 100%;
  height: 100vh;
}
.loginForm {
  position: absolute;
  left: 0;
  right: 0;
  width: 600px;
  padding: 35px 35px 15px 35px;
  margin: 120px auto;
}
.title {
  font-size: 26px;
  font-weight: 600;
  /* width: 600px; */
  color: #ffffff;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
  /* position: absolute;
  top:100px;
  left: -200px; */
}

.el-input {
  width: 400px;
  margin-left: 70px;
}
.el-button {
  width: 400px;
  margin-left: 70px;
}
.el-input__inner {
  border: 1px;
  background: rgba(0, 0, 0, 0);
}
</style>
