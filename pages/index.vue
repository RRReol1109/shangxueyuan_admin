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
        <el-row>
          <el-col :span="6">
            <span>姓名:</span>
            <span v-text="form.name"></span>
          </el-col>
          <el-col :span="6">
            <span>生日:</span>
            <span v-text="form.birthday"></span>
          </el-col>
          <el-col :span="6">
            <span>人才类别:</span>
            <span v-text="form.talentCategory"></span>
          </el-col>
          <el-col :span="6">
            <span>职称:</span>
            <span v-text="form.title"></span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <span>账号:</span>
            <span v-text="form.account"></span>
          </el-col>
          <el-col :span="6">
            <span>研究方向:</span>
            <span v-text="form.researchDirection"></span>
          </el-col>
          <el-col :span="6">
            <span>导师资格:</span>
            <span v-text="form.tutorState"></span>
          </el-col>
          <el-col :span="6">
            <span>获得现职称年月:</span>
            <span v-text="form.titleDate"></span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <span>邮箱:</span>
            <span v-text="form.email"></span>
          </el-col>
          <el-col :span="6">
            <span>参加工作年月:</span>
            <span v-text="form.workDate"></span>
          </el-col>
          <el-col :span="6">
            <span>民族:</span>
            <span v-text="form.nation"></span>
          </el-col>
          <el-col :span="6">
            <span>毕业专业:</span>
            <span v-text="form.major"></span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <span>电话:</span>
            <span v-text="form.phone"></span>
          </el-col>
          <el-col :span="6">
            <span>毕业学校:</span>
            <span v-text="form.school"></span>
          </el-col>
          <el-col :span="6">
            <span>职级:</span>
            <span v-text="form.level"></span>
          </el-col>
          <el-col :span="6">
            <span>职务:</span>
            <span v-text="form.job"></span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <span>导师:</span>
            <span v-text="form.tutor"></span>
          </el-col>
          <el-col :span="6">
            <span>导师资格:</span>
            <span v-text="form.tutorState"></span>
          </el-col>
          <el-col :span="6">
            <span>政治面貌:</span>
            <span v-text="form.politic"></span>
          </el-col>
          <el-col :span="6">
            <span>海外研修经历:</span>
            <span v-text="form.overseasExperience"></span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <span>省级奖项:</span>
            <span v-text="form.provincialAward"></span>
          </el-col>
          <el-col :span="6">
            <span>国家级奖项:</span>
            <span v-text="form.nationalAward"></span>
          </el-col>
          <el-col :span="6">
            <span>所在系:</span>
            <span v-text="form.department"></span>
          </el-col>
          <el-col :span="6">
            <span>状态:</span>
            <span v-text="form.state"></span>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import axios from "~/plugins/axios2";
import moment from "moment";
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
    // this.form.account = userInfo.account;
    // this.form.name = userInfo.name;
    // this.form.phone = userInfo.phone;
    // this.form.email = userInfo.email;
    // this.form.id = userInfo.id;
    this.form = userInfo;
    if (userInfo.birthday)
      this.form.birthday = moment(this.form.birthday).format("YYYY-MM-DD");
    if (userInfo.workDate)
      this.form.workDate = moment(this.form.workDate).format("YYYY-MM-DD");
    if (userInfo.titleDate)
      this.form.titleDate = moment(this.form.titleDate).format("YYYY-MM-DD");
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
