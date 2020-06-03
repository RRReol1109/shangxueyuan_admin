<template>
  <div>
    <div class="grid-content bg-purple-light">
      <div class="crumbs">
        <div class="name title">
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
    <div style="width:100%;">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#FFA500"
        @select="menuSelect"
        :default-active="activeIndex"
      >
        <el-menu-item class="item" index="1">全部</el-menu-item>
        <el-menu-item class="item" index="2">行政办公室</el-menu-item>
        <el-menu-item class="item" index="31">科研学科办公室</el-menu-item>
        <el-menu-item class="item" index="32">对外交流与国际认证中心</el-menu-item>
        <el-menu-item class="item" index="25">校友事务中心</el-menu-item>
        <el-menu-item class="item" index="33">本科生工作办公室</el-menu-item>
        <el-menu-item class="item" index="34">研究生工作办公室</el-menu-item>
        <el-menu-item class="item" index="35">本科生教学管理中心</el-menu-item>
        <el-menu-item class="item" index="36">专业学位教育管理中心</el-menu-item>
        <el-menu-item class="item" index="37">研究生教学管理中心</el-menu-item>
        <el-menu-item class="item" index="38">MBA中心</el-menu-item>
        <el-menu-item class="item" index="39">EMBA中心</el-menu-item>
        <el-menu-item class="item" index="40">EDP中心</el-menu-item>
        <el-menu-item class="item" index="12">教师个人</el-menu-item>
      </el-menu>
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
.title {
  font-size: 24px;
  position: absolute;
  left: 50%;
  text-align: center;
}

.item {
  font-size: 18px;
}
</style>

<script>
import axios from "~/plugins/axios2";
export default {
  data() {
    return {
      nickName: null,
      roleId: "",
      userInfo: "",
      activeIndex: "",
      ids: []
    };
  },
  mounted() {
    let roleId = window.localStorage.getItem("roleId");
    this.userInfo = window.localStorage.getItem("userInfo");
    // this.ids = window.localStorage.getItem("roles");
    this.roleId = roleId;
    this.selectDep();
  },
  methods: {
    handleCommand(command) {
      console.log("logout", command);
      if (command === "logout") {
        // 清空缓存数据
        localStorage.removeItem("nickName");
        sessionStorage.removeItem("flag");
        sessionStorage.removeItem("select");
        location.href = "Login";
      } else if (command === "main") {
        location.href = "/shangxueyuan_admin";
      } else if (command === "updata") {
        location.href = "userCenter";
      }
    },
    selectDep() {
      let deptid = JSON.parse(this.userInfo).deptid;
      let flag = window.sessionStorage.getItem("flag");
      if (!flag) {
        // this.menuSelect(deptid.toString(), "");
        this.activeIndex = deptid.toString();
      } else {
        let selectId = window.sessionStorage.getItem("select");
        this.activeIndex = selectId.toString();
        // this.menuSelect(selectId.toString(), "");
      }
    },
    menuSelect(key, keyPath) {
      console.log("hello world");
      if (this.roleId != 1) {
        switch (key) {
          case "31":
            this.ids = [777, 22, 23, 24, 25, 60, 26, 27, 44];
            break;
          case "32":
            this.ids = [777, 30];
            break;
          case "25":
            this.ids = [777, 49, 53, 57, 38, 59, 41];
            break;
          case "33":
            // this.ids = [777, 46, 47, 48, 49];
            break;
          case "34":
            // this.ids = [777, 50, 51, 52, 53];
            break;
          case "35":
            this.ids = [777, 40];
            break;
          case "36":
            break;
          case "37":
            this.ids = [777, 51, 56, 37, 39, 38];
            break;
          case "38":
            this.ids = [
              777,
              77,
              64,
              65,
              66,
              67,
              68,
              69,
              70,
              71,
              72,
              73,
              74,
              75,
              76
            ];
            break;
          case "39":
            break;
          case "40":
            break;
        }
        window.sessionStorage.setItem("select", key);
        this.saveRoles();
      }
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
      // let refresh = Request.getSession().getAttribute("refresh");
      window.sessionStorage.setItem("flag", true);
      location.reload();
      // window.localStorage.setItem("roles", "["+this.ids+"]");
    }
  }
};
</script>