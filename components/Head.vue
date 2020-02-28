<template>
  <div class="grid-content bg-purple-light">
    <div class="crumbs">
      <div class="name ban-select">
        <!-- <el-badge :is-dot="true">
        </el-badge>-->
        中南大学商学院信息管理系统
      </div>
    </div>
    <div class="self ban-select">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link name">个人中心</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="main">个人主页</el-dropdown-item>
          <el-dropdown-item command="updata">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<style>
.bg-purple-light {
  background: #fff;
}
.grid-content {
  height: 45px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0px 0px 5px 0px #aaa;
}
.crumbs {
  margin-left: 10px;
  float: left;
}
.self {
  margin-right: 20px;
  float: right;
}
.ban-select {
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.name {
  line-height: 45px;
  font-size: 16px;
}
</style>

<script>
export default {
  data() {
    return {
      nickName: null
    };
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      console.log("logout", command);
      if (command === "logout") {
        // 清空缓存数据
        localStorage.removeItem("nickName");
        location.href = "Login";
      } else if (command === "main") {
        location.href = "/shangxueyuan_admin";
      } else if (command === "updata") {
        location.href = "userCenter";
      }
    }
  }
};
</script>