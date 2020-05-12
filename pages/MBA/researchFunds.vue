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
        <el-form-item label="姓名:">
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
              <el-dropdown-item command="examine" v-if="roleId==1">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/projectFunds/upload?token='AuthenticationToken'"
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
      <el-table-column fixed prop="year" align="center" label="年份"></el-table-column>
      <el-table-column prop="leaderId" align="center" label="项目负责人工号"></el-table-column>
      <el-table-column prop="leaderName" align="center" label="项目负责人姓名"></el-table-column>
      <el-table-column prop="leaderTitle" align="center" label="负责人职称"></el-table-column>
      <!-- <el-table-column prop="student" align="center" label="项目序号"></el-table-column> -->
      <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
      <el-table-column prop="projectId" align="center" label="项目编号"></el-table-column>
      <el-table-column prop="projectLevel" align="center" label="项目级别"></el-table-column>
      <el-table-column prop="funds" align="center" label="合同经费(万元)"></el-table-column>
      <el-table-column prop="date" align="center" label="合同起止年月"></el-table-column>
      <el-table-column prop="schoolFunds" align="center" label="进校经费额(万元)"></el-table-column>
      <el-table-column prop="teacherId" align="center" label="教师工号"></el-table-column>
      <el-table-column prop="teacherName" align="center" label="教师姓名"></el-table-column>
      <el-table-column prop="teacherTitle" align="center" label="教师职称"></el-table-column>
      <el-table-column prop="distributionFunds" align="center" label="分配经费(万元)"></el-table-column>
      <el-table-column prop="titleRatio" align="center" label="职称系数"></el-table-column>
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
    <el-dialog style="min-height:500px" title :visible.sync="examineDialog">
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
    </el-dialog>
    <el-dialog
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
        <el-form-item label="项目负责人工号" prop="leaderId">
          <el-col :span="6">
            <el-input size="small" v-model="form.leaderId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目负责人姓名" prop="leaderName">
          <el-col :span="6">
            <el-input size="small" v-model="form.leaderName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="负责人职称" prop="leaderTitle">
          <el-col :span="6">
            <el-input size="small" v-model="form.leaderTitle"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-col :span="6">
            <el-input size="small" v-model="form.projectName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectId">
          <el-col :span="6">
            <el-input size="small" v-model="form.projectId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目级别" prop="projectLevel">
          <el-col :span="6">
            <el-select v-model="form.projectLevel" size="small" placeholder="请选择">
              <el-option label="国家级" value="国家级"></el-option>
              <el-option label="省部级" value="省部级"></el-option>
              <el-option label="横向" value="横向"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="合同经费(万元)" prop="funds">
          <el-col :span="6">
            <el-input size="small" v-model="form.funds"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="合同起止年月" prop="date">
          <el-col :span="6">
            <el-date-picker
              v-model="form.date"
              type="date"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="进校经费额(万元)" prop="schoolFunds">
          <el-col :span="6">
            <el-input size="small" v-model="form.schoolFunds"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教师工号" prop="teacherId">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacherId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacherName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教师职称" prop="teacherTitle">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacherTitle"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分配经费(万元)" prop="distributionFunds">
          <el-col :span="6">
            <el-input size="small" v-model="form.distributionFunds"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="职称系数" prop="titleRatio">
          <el-col :span="6">
            <el-input size="small" v-model="form.titleRatio"></el-input>
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
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="examineDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
      </div>
    </el-dialog>
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
        leaderId: "",
        leaderName: "",
        leaderTitle: "",
        projectName: "",
        projectId: "",
        projectLevel: "",
        funds: "",
        date: "",
        schoolFunds: "",
        teacherId: "",
        teacherName: "",
        teacherTitle: "",
        distributionFunds: "",
        titleRatio: "",
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
      let res = await axios.$post("/projectFunds/list", this.query);
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
        await axios.$post("/projectFunds/update", this.examineForm);
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
          await axios.$post("/projectFunds/add", this.form);
          break;
        case "edit":
          await axios.$post("/projectFunds/update", this.form);
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
          leaderId: "",
          leaderName: "",
          leaderTitle: "",
          projectName: "",
          projectId: "",
          projectLevel: "",
          funds: "",
          date: "",
          schoolFunds: "",
          teacherId: "",
          teacherName: "",
          teacherTitle: "",
          distributionFunds: "",
          titleRatio: "",
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
          location.href = "http://112.74.56.60/excel/excel-model/sjk-lxsxx.xls";
          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/projectFunds/export", {
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
            await axios.$post("/projectFunds/delete", {
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
          await axios.$post("/projectFunds/delete", {
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
</style>