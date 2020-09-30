<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="指导教师姓名:">
          <el-autocomplete
            id="nameBox"
            v-model="query.teacher"
            placeholder="请输入教师"
            :fetch-suggestions="queryTeacher"
            size="normal"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="学生学号:">
          <el-input v-model="query.studentId" placeholder="请输入学号" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名:">
          <el-input v-model="query.studentName" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="获奖时间">
          <el-date-picker v-model="query.date" type="date" placeholder="选择日期时间" size="normal"></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button type="primary" size="normal">
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
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/excellentPapers/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传数据</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column sortable align="center" type="selection" width="50"></el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="userName"
        align="center"
        label="指导教师姓名"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="type"
        align="center"
        label="获奖类别"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentName"
        align="center"
        label="获奖学生姓名"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentId"
        align="center"
        label="获奖学生学号"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentClass"
        align="center"
        label="获奖学生专业班级"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="title"
        align="center"
        label="获奖论文题目"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="date"
        align="center"
        label="获奖日期"
      ></el-table-column>
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="score" align="center" label="本人计分"></el-table-column> -->
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="auditFlag"
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="normal">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="normal">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="changeSize"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-dialog width="35%" style="min-height:500px" title="批量审核操作" :visible.sync="examineDialog">
      <el-row>
        <el-col :span="8">
          <el-button @click="examineDialog = false" size="normal" style="width:97%;">取 消</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="examineData('success')"
            size="normal"
            style="width:97%;"
          >通过</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="danger"
            @click="examineData('failed')"
            size="normal"
            style="width:97%;"
          >不通过</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份" prop="year">
              <el-date-picker
                size="normal"
                style="width:99%"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="指导教师姓名" prop="teacher">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.teacher"
              :fetch-suggestions="queryTeacher"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
            </el-form-item>-->
            <!-- <el-form-item label="指导教师工号" prop="teacher">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.teacherId" placeholder="请输入内容"></el-input>
          </el-col>
            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="指导老师" prop="teacher" v-if="showTeachInput">
              <el-select
                v-model="ruleForm.teacher"
                filterable
                placeholder="请选择老师"
                style="width:99%"
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              <!-- <el-autocomplete
                class="inline-input"
                v-model="ruleForm.teacher"
                :fetch-suggestions="queryTeacher"
                placeholder="请输入内容"
                :trigger-on-focus="false"
              ></el-autocomplete>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="获奖论文类别" prop="type">
              <!-- <el-autocomplete
                clearable
                v-model="ruleForm.type"
                :fetch-suggestions="queryStudent"
                placeholder="请输入内容"
                style="width:99%"
              ></el-autocomplete>-->
              <el-select v-model="ruleForm.type" placeholder="请输入内容" style="width:98%">
                <el-option label="湖南省优秀博士论文" value="湖南省优秀博士论文"></el-option>
                <el-option label="湖南省优秀硕博论文" value="湖南省优秀硕博论文"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖论文题目" prop="title">
              <el-autocomplete
                style="width:99%"
                clearable
                v-model="ruleForm.title"
                :fetch-suggestions="queryStudent"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="获奖学生学号" prop="studentId">
              <el-input
                clearable
                v-model="ruleForm.studentId"
                placeholder="请输入内容"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖学生姓名" prop="studentName">
              <el-autocomplete
                clearable
                v-model="ruleForm.studentName"
                :fetch-suggestions="queryStudent"
                placeholder="请输入内容"
                style="width:99%"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="获奖学生专业班级" prop="studentClass">
              <el-input
                clearable
                v-model="ruleForm.studentClass"
                placeholder="请输入内容"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖日期" prop="date">
              <el-date-picker
                v-model="ruleForm.date"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="本人计分" prop="score">
              <el-input clearable v-model="ruleForm.score" placeholder="请输入内容" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select
            v-model="ruleForm.auditFlag"
            size="normal"
            placeholder="请选择状态"
            style="width:99%"
          >
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-drawer>
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
        auditFlag: "0",
      },
      header: {},
      examineDialog: false,
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      loading: false,
      deptid: "",
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: "",
      },
      checkedList: [],
      showTeachInput: false,
      roleId: 0,
      ruleForm: {
        id: "",
        year: "",
        teacher: "",
        type: "",
        studentName: "",
        studentId: "",
        score: "",
        date: moment().format("YYYY-MM-DD"),
      },
      fileList: [],
      tableData: [],
      rules: {
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
        teacher: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
        ],
        studentName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
        ],
        studentId: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
        ],
        score: [
          { required: true, message: "请输入本人计分", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" },
        ],
      },
      names: [],
      stuNames: [],
      teacherList: [],
    };
  },

  mounted() {
    this.pressName = localStorage.getItem("pressName")
      ? JSON.parse(localStorage.getItem("pressName"))
      : [];
    this.stuNames = localStorage.getItem("stuNames")
      ? JSON.parse(localStorage.getItem("stuNames"))
      : [];
  },
  filters: {
    statusFilter: function (value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过",
      }[value.toString()];
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.names.push({
        value: this.ruleForm.year,
      });
      this.names = _.uniqWith(this.names, _.isEqual);
      localStorage.setItem("names", JSON.stringify(this.names));

      this.stuNames.push({
        value: this.ruleForm.studentName,
      });
      this.stuNames = _.uniqWith(this.stuNames, _.isEqual);
      localStorage.setItem("stuNames", JSON.stringify(this.stuNames));
    },
    async queryTeacher(queryString, cb) {
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString,
      });
      var teachers = [];
      for (let i = 0; i < teacher.length; i++) {
        const element = teacher[i];
        teachers.push({ value: element.name, id: element.id });
      }
      var results = queryString
        ? teachers.filter(this.createFilter(queryString))
        : teachers;
      cb(results);
    },
    createFilter(queryString) {
      return (teacher) => {
        return (
          teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    queryStudent(queryString, cb) {
      var stuNames = this.stuNames;
      var results = queryString
        ? stuNames.filter(this.createStudentFilter(queryString))
        : stuNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    checkCanUse() {
      this.roles = JSON.parse(localStorage.getItem("roles")).ids;
      let userId = window.localStorage.getItem("userId") || "";
      console.log("检测权限：", this.roles);
      if (this.roles.indexOf(777) != -1) {
        this.showFunctionList = true;
      } else {
        this.loginUserId = userId;
      }
      if (this.roles.indexOf(888) != -1) {
        this.showTeachInput = true;
      } else {
        this.showTeachInput = false;
      }
    },
    createStudentFilter(queryString) {
      return (stuNames) => {
        return (
          stuNames.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
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
          if (key == "date") {
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
      let res = await axios.$post("/excellentPapers/list", this.query);

      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          let verification = false;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              verification = true;
              console.log("success");
              return true;
            } else {
              verification = false;
              this.ruleForm.authors = "";
              console.log("error submit!!");
              return false;
            }
          });
          if (verification) {
          } else {
            this.$message({
              type: "info",
              message: "请填写正确数据",
            });
            return;
          }
          let teacherName = this.ruleForm.teacher;
          await axios.$post("/excellentPapers/add", this.ruleForm);
          break;
        case "edit":
          await axios.$post("/excellentPapers/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      if (this.operate === "edit" && row.auditFlag == 1) {
        this.$confirm("本条数据已审核无法修改", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {});
        return;
      }
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          id: "",
          year: "",
          teacher: "",
          type: "",
          studentName: "",
          studentId: "",
          score: "",
          date: moment().format("YYYY-MM-DD"),
          editor: JSON.parse(localStorage.getItem("userInfo")).id,
        };
      } else {
        this.ruleForm = row;
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let excellentPapersId = row.id;
          await axios.$post("/excellentPapers/delete", {
            excellentPapersId: excellentPapersId,
          });
          this.list();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData(command);
          break;
        case "examine":
          if (this.checkedList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;
        case "delCount":
          this.delCount();
          break;
        case "temp":
          this.exportData(command);
          break;
      }
    },

    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/excellentPapers/export?id=-1", {});
      } else {
        data = await axios.$download("/excellentPapers/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-优秀硕博论文.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async delCount() {
      let vm = this;
      if (this.checkedList.length == 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {});
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          for (let i = 0; i < vm.checkedList.length; i++) {
            await axios.$post("/excellentPapers/delete", {
              excellentPapersId: vm.checkedList[i].id,
            });
          }
          this.tableData = [];
          await this.list();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
          await axios.$post("/excellentPapers/update", this.examineForm);
        } else {
          this.examineForm.auditFlag = 2;
          await axios.$post("/excellentPapers/update", this.examineForm);
        }
      }
      this.$message({
        type: "success",
        message: "审核成功!",
      });
      this.examineDialog = false;
      this.list();
    },
  },
  async mounted() {
    this.header = {
      Authorization: localStorage.getItem("message"),
    };
    this.checkCanUse();
    this.roleId = localStorage.getItem("roleId");
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999,
    });
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.teacherList = this.teacherList.rows;
    this.list();
  },
};
</script>

<style>
.el-autocomplete {
  width: 100%;
}
el-from {
  overflow: auto;
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