<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>-->
        <el-form-item label="项目类别:">
          <el-select v-model="query.type" size="small" placeholder="请选择类别">
            <el-option label="全部" value></el-option>
            <el-option label="国家自然科学基金" value="国家自然科学基金"></el-option>
            <el-option label="国家社科基金" value="国家自然科学基金"></el-option>
            <el-option label="教育部人文社科基金" value="教育部人文社科基金"></el-option>
            <el-option label="湖南省自然科学基金" value="湖南省自然科学基金"></el-option>
            <el-option label="湖南省社科基金" value="湖南省社科基金"></el-option>
            <el-option label="省教育厅教改项目（普通高校教学改革研究项目）" value="省教育厅教改项目（普通高校教学改革研究项目）"></el-option>
            <el-option label="省教育厅教改项目（学位与研究生教育教学改革研究课题）" value="省教育厅教改项目（学位与研究生教育教学改革研究课题）"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称:">
          <el-input v-model="query.projectName" placeholder="请输入项目名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="项目级别:">
          <el-select v-model="query.level" size="small" placeholder="请选择级别">
            <el-option label="全部" value></el-option>
            <el-option label="重大项目" value="重大项目"></el-option>
            <el-option label="面上项目" value="面上项目"></el-option>
            <el-option label="青年项目" value="青年项目"></el-option>
            <el-option label="一般项目" value="一般项目"></el-option>
            <el-option label="基地项目" value="基地项目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="query.startDate" type="date" placeholder="选择日期时间" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="query.endDate" type="date" placeholder="选择日期时间" size="small"></el-date-picker>
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
                  action="http://bsart.zz.kuangyeyuan.com/project/upload?token='AuthenticationToken'"
                >
                  <el-button size="small" class type="text">批量上传数据</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="year" align="center" label="年度"></el-table-column>
      <!-- <el-table-column prop="name" align="center" label="姓名"></el-table-column> -->
      <el-table-column prop="type" align="center" label="项目类型"></el-table-column>
      <el-table-column prop="level" align="center" label="项目级别"></el-table-column>
      <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
      <el-table-column prop="projectFunds" align="center" label="直接经费"></el-table-column>
      <el-table-column prop="userName" align="center" label="项目主持人"></el-table-column>
      <el-table-column prop="startDate" align="center" label="开始时间"></el-table-column>
      <el-table-column prop="endDate" align="center" label="结束时间"></el-table-column>
      <el-table-column prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="downLoadFile(scope.row)" type="text" size="small">附件下载</el-button>
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

    <el-dialog style="min-height:500px" title :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="年度:" prop="year">
          <el-col :span="12">
            <el-date-picker
              size="small"
              v-model="ruleForm.year"
              type="year"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择年份"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="姓名" prop="name">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.name" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="项目类型" prop="type">
          <el-col :span="12">
            <el-select v-model="ruleForm.type" placeholder="请选择类型" @change="typeChage">
              <el-option label="国家自然科学基金" value="国家自然科学基金"></el-option>
              <el-option label="国家社科基金" value="国家社科基金"></el-option>
              <el-option label="教育部人文社科基金" value="教育部人文社科基金"></el-option>
              <el-option label="湖南省自然科学基金" value="湖南省自然科学基金"></el-option>
              <el-option label="湖南省社科基金" value="湖南省社科基金"></el-option>
              <el-option label="省教育厅教改项目（普通高校教学改革研究项目）" value="省教育厅教改项目（普通高校教学改革研究项目）"></el-option>
              <el-option label="省教育厅教改项目（学位与研究生教育教学改革研究课题）" value="省教育厅教改项目（学位与研究生教育教学改革研究课题）"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="其他" v-if="elFlag">
          <el-col :span="6">
            <el-input v-model="ruleForm.typeF" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目级别" prop="level">
          <el-col :span="12">
            <el-select v-model="ruleForm.level" placeholder="请选择级别">
              <el-option label="重大项目" value="重大项目"></el-option>
              <el-option label="面上项目" value="面上项目"></el-option>
              <el-option label="重点项目" value="重点项目"></el-option>
              <el-option label="青年项目" value="青年项目"></el-option>
              <el-option label="一般项目" value="一般项目"></el-option>
              <el-option label="基地项目" value="基地项目"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.projectName"
              :fetch-suggestions="queryProjects"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="直接经费" prop="projectFunds">
          <el-col :span="12">
            <el-input
              clearable
              v-model="ruleForm.projectFunds"
              oninput="value=value.replace(/[^\d.]/g,'')"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目主持人" prop="teacher">
          <el-col :span="12">
            <el-select v-model="ruleForm.teacher" placeholder="请选择老师">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="fileUploadSuccess"
            action="http://bsart.zz.kuangyeyuan.com/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="small" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="开始时间" prop="开始时间">
          <el-col :span="12">
            <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" prop="结束时间">
          <el-col :span="12">
            <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="small" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  data() {
    var validateNumber = (rule, value, callback) => {
      if (!value || value <= 0) {
        value = parseInt(value);
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    };
    return {
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      examineDialog: false,
      loading: false,
      tableData: [],
      header: {},
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      fileurl: "",
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      elFlag: false,
      roleId: 0,
      teacherList: [],
      fileList: [],
      fileLists: [],
      ruleForm: {
        id: "",
        // name: "",
        type: "1",
        level: "1",
        projectName: "",
        projectFunds: 0,
        typeF: "",
        startDate: moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD")
      },
      rules: {
        teacher: [{ required: true, message: "请选择老师", trigger: "blur" }],
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        level: [{ required: true, message: "请选择项目级别", trigger: "blur" }],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        year: [{ required: true, message: "请输入年份", trigger: "blur" }],
        projectFunds: [
          { required: true, message: "请输入直接经费", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ]
      },
      projects: []
    };
  },
  mounted() {
    this.projects = localStorage.getItem("projects")
      ? JSON.parse(localStorage.getItem("projects"))
      : [];
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "审核已通过",
        "2": "审核未通过"
      }[value.toString()];
    }
  },
  methods: {
    typeChage() {
      console.log(this.ruleForm.type, "type");
      if (this.ruleForm.type == "其他") {
        this.elFlag = true;
        console.log(123456);
      } else {
        this.elFlag = false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.projects.push({
        value: this.ruleForm.projectName
      });
      this.projects = _.uniqWith(this.projects, _.isEqual);
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
    queryProjects(queryString, cb) {
      var projects = this.projects;
      var results = queryString
        ? projects.filter(this.createProjectsFilter(queryString))
        : projects;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createProjectsFilter(queryString) {
      return projects => {
        return (
          projects.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      this.loading = true;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "endDate" || key == "startDate") {
            console.log(typeof element);
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
            console.log(element);
          }
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = localStorage.getItem("userId");
      }
      let res = await axios.$post("/project/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    downLoadFile(rows) {
      if (rows.files) {
        window.open(rows.files);
      } else {
        this.$message({
          type: "info",
          message: "该条记录无附件"
        });
      }
    },
    async exportData() {
      let data = await axios.$download("/project/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "excel.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          this.ruleForm.files = this.fileurl;
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];
              if (
                !element &&
                key != "auditFlag" &&
                key != "id" &&
                key != "finalScore"
              ) {
                console.log(element, "==========element===" + key);
                this.$message({
                  type: "info",
                  message: "请填写正确数据"
                });
                return;
              }
            }
          }
          if (this.ruleForm.type == "其他") {
            this.ruleForm.type = this.ruleForm.typeF;
          }
          await axios.$post("/project/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          await axios.$post("/project/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    uploadSuccess() {
      this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          id: "",
          year: "",
          type: "",
          level: "",
          projectName: "",
          projectFunds: 0,
          teacher: "",
          startDate: moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD"),
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
      } else {
        this.ruleForm = row;
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let projectId = row.id;
          await axios.$post("/project/delete", {
            projectId: projectId
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
          location.href = "http://112.74.56.60/excel/excel-model/kyjl-kyxm.xls";
          break;
      }
    },

    async changeFlag(row) {
      row.pick = !row.pick;
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
            let projectId = element.id;
            await axios.$post("/project/delete", {
              projectId: projectId
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
        await axios.$post("/project/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    }
  },
  async mounted() {
    this.teacherList = await axios.$get("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.list();
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>

<style>
.el-autocomplete {
  width: 100%;
}
</style>