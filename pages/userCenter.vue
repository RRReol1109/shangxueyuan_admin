<template>
  <div class="background">
    <el-form
      label-width="180px"
      :model="formLabelAlign"
    >
      <el-form-item label="输入原密码">
        <el-input
          v-model="formLabelAlign.oldPwd"
          clearable
          type="password"
          prefix-icon="el-icon-view"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="输入新密码">
        <el-input
          v-model="formLabelAlign.newPwd"
          clearable
          type="password"
          prefix-icon="el-icon-view"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码">
        <el-input
          id="passInput"
          v-model="formLabelAlign.rePwd"
          type="password"
          clearable
          prefix-icon="el-icon-view"
          placeholder="再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%" @click="updata" :loading="loading">确认修改</el-button>
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

<style>
.background {
  margin: 0 auto;
  width: 600px;
}
</style>
