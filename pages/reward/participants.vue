<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="年份:">
          <el-date-picker
            size="small"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="会议时间">
          <el-date-picker v-model="query.date" type="date" placeholder="选择日期时间"></el-date-picker>
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
      </el-form>
    </div>
    <el-dropdown @command="handleCommand" style="float:right;">
      <el-button type="primary">
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
            action="http://bsart.zz.kuangyeyuan.com/excellentPapers/upload?token='AuthenticationToken'"
          >
            <el-button size="small" class type="text">批量上传数据</el-button>
          </el-upload>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="year" align="center" label="会议名称"></el-table-column>
      <el-table-column prop="studentName" align="center" label="会议时间"></el-table-column>
      <el-table-column prop="teacher" align="center" label="会议地点"></el-table-column>
      <el-table-column prop="type" align="center" label="是否发表演讲"></el-table-column>
      <el-table-column prop="studentId" align="center" label="是否发表会议论文"></el-table-column>
      <el-table-column prop="studentId" align="center" label="会议论文名称"></el-table-column>
      <el-table-column prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
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
    <el-dialog style="min-height:500px" title :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <!-- <el-form-item label="年份" prop="year">
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
        </el-form-item>-->
        <el-form-item label="会议名称" prop="teacher">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.teacher"
              :fetch-suggestions="queryTeacher"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="会议时间" prop="date">
          <el-col :span="12">
            <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="会议地点" prop="teacher">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.teacherId" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否发表演讲" prop="studentName">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.studentName"
              :fetch-suggestions="queryStudent"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="是否发表会议论文" prop="studentId">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.studentId" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会议论文名称" prop="studentId">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.studentId" placeholder="请输入内容"></el-input>
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
      header: {},
      examineDialog: false,
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      query: {
        limit: 14,
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
        "1": "审核已通过",
        "2": "审核未通过"
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
          location.href = "http://112.74.56.60/excel/excel-model/kyjl-ktjx.xls";
          break;
      }
    },

    uploadSuccess() {
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
        await axios.$post("/excellentPapers/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
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
</style>