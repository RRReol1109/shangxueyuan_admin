<template>
  <div>
    <el-row :gutter="24" v-if="showWaitProcess">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>工作量待办</span>
          </div>
          <div style="color:#409EFF">
            <span>未审核：</span>
            <span v-text="msg.workload">80</span>
          </div>
          <div style="color:#409EFF">
            <span>昨日新增：</span>
            <span v-text="msg.newWordload">5</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>科研奖励待办</span>
          </div>
          <div style="color:#409EFF">
            <span>未审核：</span>
            <span v-text="msg.reward">80</span>
          </div>
          <div style="color:#409EFF">
            <span>昨日新增：</span>
            <span v-text="msg.newReward">5</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>信息数据库</span>
          </div>
          <div style="color:#409EFF">
            <span>未审核：</span>
            <span v-text="msg.database">80</span>
          </div>
          <div style="color:#409EFF">
            <span>昨日新增：</span>
            <span v-text="msg.newDatabase">5</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 12px">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <div>
        <span>姓名:</span>
        <span v-text="form.name"></span>
      </div>
      <div>
        <span>id:</span>
        <span v-text="form.id"></span>
      </div>
      <div>
        <span>账号:</span>
        <span v-text="form.account"></span>
      </div>
      <div>
        <span>邮箱:</span>
        <span v-text="form.email"></span>
      </div>
      <div>
        <span>电话:</span>
        <span v-text="form.phone"></span>
      </div>
    </el-card>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {
    Logo
  },
  data() {
    return {
      showWaitProcess: false,
      tableData: "",
      roleid: "",
      form: { account: "", name: "", email: "", phone: "" },
      msg: {
        newDatabase: "",
        newReward: "",
        newWordload: "",
        database: "",
        reward: "",
        workload: ""
      },
      flag: false
    };
  },
  mounted() {
    this.checkCanUse();
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    this.form.account = userInfo.account;
    this.form.name = userInfo.name;
    this.form.phone = userInfo.phone;
    this.form.email = userInfo.email;
    this.form.id = userInfo.id;
    this.roleid = userInfo.roleid;
    this.queryTeacher();
    this.queryInfo();
  },
  methods: {
    async queryTeacher() {
      let teachers = await axios.$get("/mgr/quicklist", { params: "" });
      localStorage.setItem("teachers", JSON.stringify(teachers));
      console.log(teachers);
    },
    checkCanUse() {
      this.roles = window.localStorage.getItem("roles")
        ? JSON.parse(window.localStorage.getItem("roles"))
        : [];
      console.log("检测权限：", this.roles);
      if (this.roles.indexOf(888) != -1) {
        this.showWaitProcess = true;
      }
    },
    async queryInfo() {
      let info = await axios.$get("/mgr/get_notify", { params: "" });
      for (const key in info.data) {
        if (info.data.hasOwnProperty(key)) {
          const element = info.data[key];
          if (key == "工作量待审核") {
            this.msg.workload = element;
          } else if (key == "数据库待审核") {
            this.msg.database = element;
          } else if (key == "科研奖励待审核") {
            this.msg.reward = element;
          } else if (key == "昨日新增工作量") {
            this.msg.newWordload = element;
          } else if (key == "昨日新增数据库") {
            this.msg.newDatabase = element;
          } else if (key == "昨日新增科研奖励") {
            this.msg.newReward = element;
          }
        }
      }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.h3Text {
  font-size: 30px;
  margin-right: 10px;
  line-height: 30px;
}
#userInfo {
  position: absolute;
  font-size: 24px;
  color: #35495e;
  left: 300px;
  top: 100px;
}

.el-span {
  color: rgba(0, 0, 0, 1);
  font-size: 24px;
}

.el-form-item {
  line-height: 24px;
}
</style>
