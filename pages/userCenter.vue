<template>
  <div class="background">
    <el-form
      label-position="left"
      label-width="0px"
      :model="formLabelAlign"
      class="card-box loginForm"
    >
      <!-- <h3 class="title">修改密码</h3> -->
      <el-form-item label="输入原密码" label-width="20">
        <el-input
          v-model="formLabelAlign.oldPwd"
          clearable
          type="password"
          prefix-icon="el-icon-view"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="输入新密码" label-width="20">
        <el-input
          v-model="formLabelAlign.newPwd"
          clearable
          type="password"
          prefix-icon="el-icon-view"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码" label-width="20">
        <el-input
          id="passInput"
          v-model="formLabelAlign.rePwd"
          type="password"
          clearable
          prefix-icon="el-icon-view"
          size="large"
          placeholder="再次输入密码"
          style="margin-left:57px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updata" :loading="loading">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  data() {
    return {
      loading: false,
      formLabelAlign: {}
    };
  },
  methods: {
    async updata() {
      if (this.formLabelAlign.password == this.formLabelAlign.rePassword) {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let info = {
          id: userInfo.id,
          account: userInfo.account,
          newPwd: this.formLabelAlign.newPwd,
          rePwd: this.formLabelAlign.rePwd,
          oldPwd: this.formLabelAlign.oldPwd
        };
        await axios.$post("/mgr/changePwd", info);
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      } else {
        this.$confirm("两次输入密码不一致", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }
    }
  }
};
</script>

<style scoped>
.background {
  background-color: #ffffff;
  /* background-image: url(//oem.faisys.com/image/demo2.png); */
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
  width: 700px;
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
