<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年级"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="教职工姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="small" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1||roleId==19">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/teacherConference/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="year" align="center" label="年份"></el-table-column>
      <el-table-column prop="teacherId" align="center" label="教职工工号"></el-table-column>
      <el-table-column prop="name" align="center" label="教职工姓名"></el-table-column>
      <!-- <el-table-column prop="entrance" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="studentType" align="center" label="研究生类别"></el-table-column>
      <el-table-column prop="studentGrade" align="center" label="研究生年级"></el-table-column>
      <el-table-column prop="studentMajor" align="center" label="研究生专业"></el-table-column>
      <el-table-column prop="author" align="center" label="全部作者列表"></el-table-column>
      <el-table-column prop="title" align="center" label="论文题目"></el-table-column>
      <el-table-column prop="conferenceName" align="center" label="学术会议名称"></el-table-column>
      <el-table-column prop="conferenceAddress" align="center" label="学术会议举办地点"></el-table-column>
      <el-table-column prop="conferenceOrganizer" align="center" label="学术会议组织者"></el-table-column>
      <el-table-column prop="conferenceDate" align="center" label="会议年月"></el-table-column>
      <el-table-column prop="papersName" align="center" label="学术会议论文集名称"></el-table-column>
      <el-table-column prop="tutorIndex" align="center" label="本人排名"></el-table-column>
      <el-table-column prop="level" align="center" label="院定级别"></el-table-column>
      <el-table-column prop="authorCnt" align="center" label="作者总数"></el-table-column>
      <el-table-column prop="timesCited" align="center" label="论文他引次数"></el-table-column>
      <el-table-column prop="role" align="center" label="参会角色"></el-table-column>
      <el-table-column prop="pdfUrl" align="center" label="上传全文PDF电子版"></el-table-column>
      <el-table-column prop="point" align="center" label="业绩点"></el-table-column>
      <el-table-column prop="score" align="center" label="考核分"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination
        background
        :page-size="14"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-drawer size="40%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="100px"
        class="demo-examineForm"
      >
        <el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="examineForm.auditFlag" size="small" placeholder="请选择状态">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="examineDialog = false" size="small">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="年份" prop="year">
          <el-col :span="6">
            <el-date-picker
              v-model="form.year"
              type="date"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="教职工工号" prop="teacherId">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacherId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教职工姓名" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="研究生类别" prop="studentType">
          <el-select v-model="form.studentType" size="small" placeholder="请选择">
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="博士后" value="博士后"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="研究生年级:" prop="studentGrade">
          <el-date-picker
            v-model="form.studentGrade"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="研究生专业" prop="studentMajor">
          <el-select v-model="form.studentMajor" size="small">
            <el-option label="管理科学与工程" value="管理科学与工程"></el-option>
            <el-option label="工商管理" value="工商管理"></el-option>
            <el-option label="企业管理" value="企业管理"></el-option>
            <el-option label="金融学" value="金融学"></el-option>
            <el-option label="会计学" value="会计学"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部作者列表" prop="author">
          <el-col :span="6">
            <el-input size="small" v-model="form.author"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="论文题目" prop="title">
          <el-col :span="6">
            <el-input size="small" v-model="form.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学术会议名称" prop="conferenceName">
          <el-col :span="6">
            <el-input size="small" v-model="form.conferenceName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学术会议举办地点" prop="conferenceAddress">
          <el-col :span="6">
            <el-input size="small" v-model="form.conferenceAddress"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学术会议组织者" prop="conferenceOrganizer">
          <el-col :span="6">
            <el-input size="small" v-model="form.conferenceOrganizer"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会议年月" prop="conferenceDate">
          <el-col :span="6">
            <el-date-picker
              v-model="form.conferenceDate"
              type="date"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="学术会议论文集名称" prop="papersName">
          <el-col :span="6">
            <el-input size="small" v-model="form.papersName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="本人排名" prop="tutorIndex">
          <el-col :span="6">
            <el-input size="small" v-model="form.tutorIndex"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="院定级别" prop="level">
          <el-col :span="6">
            <el-input size="small" v-model="form.level"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="作者总数" prop="authorCnt">
          <el-col :span="6">
            <el-input size="small" v-model="form.authorCnt"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="论文他引次数" prop="timesCited">
          <el-col :span="6">
            <el-input size="small" v-model="form.timesCited"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="参会角色" prop="role">
          <el-col :span="6">
            <el-input size="small" v-model="form.role"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="上传全文PDF电子版" prop="pdfUrl">
          <el-col :span="6">
            <el-input size="small" v-model="form.pdfUrl"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="业绩点" prop="point">
          <el-col :span="6">
            <el-input size="small" v-model="form.point"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="考核分" prop="score">
          <el-col :span="6">
            <el-input size="small" v-model="form.score"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="examineDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
import moment from "moment";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      fileList: [],
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      header: {},
      rules: {},
      form: {
        year: "",
        teacherId: "",
        studentType: "",
        studentGrade: "",
        studentMajor: "",
        author: "",
        title: "",
        conferenceName: "",
        conferenceAddress: "",
        conferenceOrganizer: "",
        conferenceDate: "",
        papersName: "",
        tutorIndex: "",
        level: "",
        authorCnt: "",
        timesCited: "",
        role: "",
        pdfUrl: "",
        point: "",
        score: ""
      },
      tableData: []
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async list() {
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "entryTime" || key == "graduationTime") {
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
          }
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = user.id;
      }
      let res = await axios.$post("/teacherConference/list", this.query);
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          const element = res.rows[i];
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const item = element[key];
              if (key == "entryTime" || key == "graduationTime") {
                element[key] = moment(item).format("YYYY-MM-DD");
                console.log(element[key]);
              }
            }
          }
        }
      }
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    uploadSuccess() {
      this.list();
    },
    async examineData() {
      let examineList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          examineList.push(element);
        }
      }
      for (let i = 0; i < examineList.length; i++) {
        const element = examineList[i];
        console.log(element.auditFlag);
        this.examineForm.id = element.id;
        await axios.$post("/teacherConference/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    async submitForm(formName) {
      let verification = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          verification = true;
          console.log("success");
          return true;
        } else {
          verification = false;
          console.log("error submit!!");
          return false;
        }
      });
      if (verification) {
      } else {
        this.$message({
          type: "info",
          message: "请填写正确数据"
        });
        return;
      }
      switch (this.operate) {
        case "add":
          await axios.$post("/teacherConference/add", this.form);
          break;
        case "edit":
          await axios.$post("/teacherConference/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          year: "",
          teacherId: "",
          name: "",
          entrance: "",
          studentAuthor: "",
          studentType: "",
          studentGrade: "",
          studentMajor: "",
          authorCnt: "",
          tutorIndex: "",
          studentIndex: "",
          author: "",
          title: "",
          journal: "",
          titleDate: "",
          publishInfo: "",
          pageRange: "",
          origin: "",
          esi: "",
          level: "",
          issn: "",
          impactFactor: "",
          timesCited: "",
          pdfUrl: "",
          point: "",
          score: ""
        };
      } else {
        this.form = row;
      }
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData();
          break;
        case "examine":
          let deleteList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element);
            if (element.pick) {
              deleteList.push(element);
            }
          }
          if (deleteList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;

        case "delCount":
          this.delCount();
          break;
        case "temp":
          location.href = "http://bsoa.csu.edu.cn/excel-model/sjk-lxsxx.xls";
          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/teacherConference/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-lxsxx.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async delCount() {
      let deleteList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          deleteList.push(element);
        }
      }
      if (deleteList.length <= 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          for (let i = 0; i < deleteList.length; i++) {
            const element = deleteList[i];
            let internationalStudentId = element.id;
            await axios.$post("/teacherConference/delete", {
              internationalStudentId: internationalStudentId
            });
          }
          this.tableData = [];
          await this.list();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let internationalStudentId = row.id;
          await axios.$post("/teacherConference/delete", {
            internationalStudentId: internationalStudentId
          });
          this.list();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    this.roleId = localStorage.getItem("roleId");
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>