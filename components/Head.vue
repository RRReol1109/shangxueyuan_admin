<template>
  <div>
    <div class="grid-content bg-purple-light">
      <div class="crumbs">
        <div class="name title">中南大学商学院信息管理系统</div>
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
    <el-collapse style="border: 0px">
      <el-collapse-item title="选择部门" name="1">
        <template slot="title">
          <div class="headline">
            <i class="el-icon-guide"></i>
            <span>选择部门(鼠标移动到此位置点击可展开部门选择)</span>
          </div>
        </template>
        <div style="width: 100%">
          <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#FFA500"
            @select="menuSelect"
            :default-active="activeIndex"
          >
            <el-menu-item class="item" index="1" v-if="roleId == 1"
              >全部</el-menu-item
            >
            <el-menu-item class="item" index="2" v-if="deptid != 41"
              >行政办公室</el-menu-item
            >
            <el-menu-item class="item" index="31" v-if="deptid != 41"
              >科研学科办公室</el-menu-item
            >
            <el-menu-item class="item" index="33" v-if="deptid != 41"
              >本科生工作办公室</el-menu-item
            >
            <el-menu-item class="item" index="34" v-if="deptid != 41"
              >研究生工作办公室</el-menu-item
            >
            <el-menu-item class="item" index="35" v-if="deptid != 41"
              >本科生教学管理中心</el-menu-item
            >
            <el-menu-item class="item" index="37" v-if="deptid != 41"
              >研究生教学管理中心</el-menu-item
            >
            <el-menu-item class="item" index="32" v-if="deptid != 41"
              >对外交流与国际认证中心</el-menu-item
            >
            <el-menu-item class="item" index="25" v-if="deptid != 41"
              >校友事务中心</el-menu-item
            >
            <el-menu-item class="item" index="36" v-if="deptid != 41"
              >专业学位硕士办公室</el-menu-item
            >
            <el-menu-item class="item" index="38" v-if="deptid != 41"
              >MBA中心</el-menu-item
            >
            <el-menu-item class="item" index="39" v-if="deptid != 41"
              >EMBA中心</el-menu-item
            >
            <el-menu-item class="item" index="40" v-if="deptid != 41"
              >EDP中心</el-menu-item
            >
            <!-- <el-menu-item class="item" index="41">教师个人</el-menu-item> -->
          </el-menu>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style>
.bg-purple-light {
  background: #fff;
}
.grid-content {
  background-color: #545c64;
  color: #fff;
  height: 60px;
  /* border-bottom: 1px solid #e6e6e6; */
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
  line-height: 60px;
  font-size: 18px;
  color: #fff;
}
.title {
  line-height: 60px;
  font-size: 30px;
  position: absolute;
  left: 50%;
  margin-left: -195px;
  text-align: center;
}

.item {
  font-size: 16px;
  text-align: center;
  width: 200px;
}

.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 40px;
  line-height: 40px;
  margin: 0;
  border-bottom: 2px solid transparent;
  color: #909399;
}

.el-collapse-item__content {
  padding-bottom: 0px;
  font-size: 13px;
  color: #303133;
  line-height: 1.769230769230769;
}
.headline {
  font-size: 20px;
  position: absolute;
  left: 50%;
  margin-left: -207.24px;
}
.el-collapse-item__header {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 48px;
  line-height: 48px;
  background-color: #545c64;
  color: #fff;
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
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
      ids: [],
      deptid: "",
    };
  },
  mounted() {
    let roleId = window.localStorage.getItem("roleId");
    this.userInfo = window.localStorage.getItem("userInfo");
    // this.ids = window.localStorage.getItem("roles");
    this.roleId = roleId;
    if (this.roleId == 1) {
      this.ids = [
        777,
        888,
        999,
        1,
        2,
        4,
        5,
        7,
        8,
        9,
        10,
        6,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        60,
        26,
        27,
        // 61,
        // 62,
        28,
        29,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        39,
        38,
        58,
        59,
        40,
        41,
        42,
        43,
        44,
        45,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        104,
        105,
        106,
        107,
        108,
        109,
      ];
      this.saveRoles();
      this.activeIndex = 1;
      return;
    } else this.selectDep();
  },
  methods: {
    handleCommand(command) {
      console.log("logout", command);
      if (command === "logout") {
        // 清空缓存数据
        localStorage.removeItem("nickName");
        sessionStorage.removeItem("flag");
        sessionStorage.removeItem("select");
        location.href = "/shangxueyuan_admin/Login";
      } else if (command === "main") {
        location.href = "/shangxueyuan_admin";
      } else if (command === "updata") {
        location.href = "/shangxueyuan_admin/userCenter";
      }
    },
    selectDep() {
      this.deptid = JSON.parse(this.userInfo).deptid;
      let deptid = this.deptid;
      let flag = window.sessionStorage.getItem("flag");
      if (this.roleId == 1) {
        this.activeIndex = 1;
        this.menuSelect(activeIndex);
        return;
      }
      // if (!flag) {
      // this.menuSelect(deptid.toString(), "");
      this.activeIndex = deptid.toString();
      this.menuSelect(activeIndex);
      // } else {
      //   let selectId = window.sessionStorage.getItem("select");
      //   this.activeIndex = selectId.toString();
      //   // this.menuSelect(selectId.toString(), "");
      // }
    },
    menuSelect(key) {
      // if (this.roleId != 1) {
      console.log(key, "key");
      switch (key) {
        case "31":
          this.ids = [
            777,
            22,
            23,
            24,
            25,
            60,
            26,
            27,
            44,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
        case "32":
          this.ids = [777, 30, 31];
          break;
        case "25":
          this.ids = [
            777,
            49,
            53,
            57,
            38,
            59,
            41,
            34,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            109,
          ];
          break;
        case "33":
          // this.ids = [777, 46, 47, 48, 49];
          this.ids = [
            777,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
        case "34":
          // this.ids = [777, 50, 51, 52, 53];
          this.ids = [
            777,
            81,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
          ];
          break;
        case "35":
          this.ids = [
            777,
            13,
            14,
            16,
            17,
            18,
            19,
            13,
            14,
            16,
            17,
            18,
            19,
            20,
            40,
            29,
            30,
            31,
            37,
            90,
            91,
            92,
            93,
            94,
          ];
          break;
        case "36":
          this.ids = [
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
        case "37":
          this.ids = [
            777,
            51,
            56,
            37,
            39,
            38,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
        case "38":
          this.ids = [
            777,
            77,
            64,
            65,
            74,
            75,
            76,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            109,
          ];
          break;
        case "39":
          this.ids = [
            777,
            77,
            64,
            65,
            74,
            75,
            76,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            109,
          ];
          break;
        case "40":
          this.ids = [
            777,
            77,
            64,
            65,
            74,
            75,
            76,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
        case "1":
          this.ids = [
            777,
            888,
            999,
            1,
            2,
            4,
            5,
            7,
            8,
            9,
            10,
            6,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            60,
            26,
            27,
            28,
            29,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
          ];
          break;
        case "41":
          this.ids = [
            777,
            888,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            21,
            22,
            23,
            24,
            25,
            60,
            26,
            27,
            29,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
          ];
          break;
        case "2":
          this.ids = [
            777,
            1,
            5,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            39,
            38,
            58,
            59,
            40,
            41,
            42,
            43,
            44,
            45,
          ];
          break;
      }
      window.sessionStorage.setItem("select", key);
      this.saveRoles();
    },
    async saveRoles() {
      console.log("保存权限123：", this.roleId, "----", this.ids);
      this.$store.commit("setRole", this.ids);
      let roleIds = this.ids;
      window.sessionStorage.setItem("flag", true);
      localStorage.setItem("roles", JSON.stringify({ ids: this.ids }));
    },
  },
};
</script>