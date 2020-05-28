<template>
  <div>
    <div style="width:100%;">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#FFA500"
        @select="menuSelect"
      >
        <el-menu-item class="item" index="1">科研学科办公室</el-menu-item>
        <el-menu-item class="item" index="2">对外交流与国际认证</el-menu-item>
        <el-menu-item class="item" index="3">校友事务中心</el-menu-item>
        <el-menu-item class="item" index="4">本科生工作办公室</el-menu-item>
        <el-menu-item class="item" index="5">研究生工作办公室</el-menu-item>
        <el-menu-item class="item" index="6">本科生教学管理中心</el-menu-item>
        <el-menu-item class="item" index="7">专业学位教育管理中心</el-menu-item>
        <el-menu-item class="item" index="8">研究生教学管理中心</el-menu-item>
        <el-menu-item class="item" index="9">MBA中心</el-menu-item>
        <el-menu-item class="item" index="10">EMBA中心</el-menu-item>
        <el-menu-item class="item" index="11">EDP中心</el-menu-item>
        <el-menu-item class="item" index="12">教师个人</el-menu-item>
      </el-menu>
    </div>
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

.item {
  font-size: 16px;
}
</style>

<script>
import axios from "~/plugins/axios2";
export default {
  data() {
    return {
      nickName: null,
      roleId: "",
      ids: []
    };
  },
  mounted() {
    let roleId = window.localStorage.getItem("roleId");
    this.roleId = roleId;
  },
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
    },
    menuSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.ids = [777, 22, 23, 24, 26, 27, 44];
          break;
        case "2":
          break;
        case "3":
          break;
        case "4":
          break;
        case "5":
          break;
        case "6":
          break;
        case "7":
          break;
      }
      this.saveRoles();
    },
    async saveRoles() {
      console.log("保存权限：", this.roleId, "----", this.ids);
      if (this.roleId == 1) {
        this.ids = this.ids.concat([1, 2, 4, 5, 7, 8, 9, 10, 6, 11, 12]);
      }
      await axios.$post("/role/setAuthority", {
        roleId: this.roleId,
        ids: this.ids.join()
      });
    }
  }
};
</script>