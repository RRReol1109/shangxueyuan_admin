<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="年份:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="课题时间">
          <el-date-picker v-model="query.date" type="date" placeholder="选择日期时间"></el-date-picker>
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
            <el-button size="normal" type="primary">
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
                  action="http://bs.hk.darkal.cn/abroad/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" height="600" v-loading="loading">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pick"
        align="center"
        label="选择"
        width="50"
      >
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="year"
        align="center"
        label="课题名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="teacher"
        align="center"
        label="课题主持人"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="type"
        align="center"
        label="课题合作方"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentName"
        align="center"
        label="课题时间"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentId"
        align="center"
        label="课题经费"
      ></el-table-column>
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
          <el-button
            @click="operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"

          >编辑</el-button>
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
        <!-- <el-form-item label="年份" prop="year">
          <el-col :span="12">
            <el-date-picker
              size="normal"
              v-model="ruleForm.year"
              type="year"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择年份"
            ></el-date-picker>
          </el-col>
        </el-form-item>-->
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课题名称" prop="teacher"></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课题主持人" prop="teacher">
              <el-autocomplete
                clearable
                style="width:99%"
                v-model="ruleForm.teacher"
                :fetch-suggestions="queryTeacher"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课题合作方" prop="studentName">
              <el-autocomplete
                clearable
                style="width:99%"
                v-model="ruleForm.studentName"
                :fetch-suggestions="queryStudent"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课题经费" prop="studentId">
              <el-input
                clearable
                v-model="ruleForm.studentId"
                placeholder="请输入内容"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课题时间" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            placeholder="选择日期时间"
            style="width:99%"
          ></el-date-picker>
        </el-form-item>
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
        auditFlag: "0"
      },
      header: {},
      examineDialog: false,
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      roleId: 0,
      ruleForm: {
        id: "",
        year: "",
        teacher: "",
        type: "1",
        studentName: "",
        studentId: "",
        score: "",
        date: moment().format("YYYY-MM-DD")
      },
      fileList: [],
      tableData: [],
      rules: {
        year: [{ required: true, message: "教师工号", trigger: "blur" }],
        year: [{ required: true, message: "请输入教师姓名", trigger: "blur" }],
        studentName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" }
        ],
        score: [
          { required: true, message: "请输入本人计分", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ]
      },
      names: [],
      stuNames: [],
      teacherList: {}
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
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.names.push({
        value: this.ruleForm.year
      });
      this.names = _.uniqWith(this.names, _.isEqual);
      localStorage.setItem("names", JSON.stringify(this.names));

      this.stuNames.push({
        value: this.ruleForm.studentName
      });
      this.stuNames = _.uniqWith(this.stuNames, _.isEqual);
      localStorage.setItem("stuNames", JSON.stringify(this.stuNames));
    },
    async queryTeacher(queryString, cb) {
      console.log(123);
      console.log(queryString);
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString
      });
      var teachers = [];
      for (let i = 0; i < teacher.length; i++) {
        const element = teacher[i];
        teachers.push({ value: element.name, id: element.id });
      }
      console.log(teachers);
      var results = queryString
        ? teachers.filter(this.createFilter(queryString))
        : teachers;
      cb(results);
    },
    createFilter(queryString) {
      return teacher => {
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
    createStudentFilter(queryString) {
      return stuNames => {
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
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
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
          type: "warning"
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
          type: "1",
          studentName: "",
          studentId: "",
          score: "",
          date: moment().format("YYYY-MM-DD"),
          editor: JSON.parse(localStorage.getItem("userInfo")).id
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
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let excellentPapersId = row.id;
          await axios.$post("/excellentPapers/delete", {
            excellentPapersId: excellentPapersId
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
          this.exportData(command);
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
          location.href = "http://bsoa.csu.edu.cn/excel-model/kyjl-ktjx.xls";
          break;
      }
    },

    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
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
            let excellentPapersId = element.id;
            await axios.$post("/excellentPapers/delete", {
              excellentPapersId: excellentPapersId
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
    changeSize(val) {
      this.query.limit = val;
      this.list();
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
    }
  },
  mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.roleId = localStorage.getItem("roleId");
    this.list();
  }
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