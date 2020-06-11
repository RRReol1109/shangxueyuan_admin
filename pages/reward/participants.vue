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
        <el-form-item label="会议时间">
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
                  action="http://bs.hk.darkal.cn/excellentPapers/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-dropdown @command="handleCommand" style="float:right;">
      <el-button type="primary">
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
    </el-dropdown>-->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
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
      <el-table-column
        :show-overflow-tooltip="true"
        type="index"
        label="序号"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="会议中文名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="会议英文名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="参会人"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="studentName"
        align="center"
        label="参会人所在系"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="teacher" align="center" label="参会人职称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="是否发表演讲"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="是否发表论文"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="会议时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        fixed="right"
        align="center"
        label="操作"
        width="150"
      >
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
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="150px"
        class="demo-examineForm"
      >
        <el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="examineForm.auditFlag" size="normal" placeholder="请选择状态">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="examineDialog = false" size="normal">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="normal">确定</el-button>
            <el-button size="normal" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
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
              size="normal"
              v-model="ruleForm.year"
              type="year"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择年份"
            ></el-date-picker>
          </el-col>
        </el-form-item>-->
        <el-form-item label="会议中文名" prop>
          <el-input learable v-model="ruleForm.chinesename" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="会议英文名" prop>
          <el-input learable v-model="ruleForm.englishname" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="会议英文缩写" prop>
          <el-input learable v-model="ruleForm.englishnameabbr" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参会人姓名" prop="doi">
              <el-input learable v-model="ruleForm.teacher" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参会人所在系" prop="doi">
              <el-input learable v-model="ruleForm.belongdepartment" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参会人职称" prop="doi">
              <el-input learable v-model="ruleForm.positiontitle" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议时间" prop="doi">
              <el-date-picker
                v-model="ruleForm.date"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="会议地点" prop="teacher">
          <el-input clearable v-model="ruleForm.address" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否发表演讲" prop>
              <el-select placeholder="请选择" v-model="ruleForm.ispublishspeech" style="width:98%">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否发表论文" prop>
              <el-select placeholder="请选择" v-model="ruleForm.ispublishpaper" style="width:98%">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="ruleForm.ispublishspeech == '是'" label="会议演讲题目" prop="studentId">
          <el-input clearable v-model="ruleForm.studentId" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <div v-if="ruleForm.ispublishpaper == '是'">
          <el-form-item label="会议论文名称" prop="studentId">
            <el-input clearable v-model="ruleForm.studentId" placeholder="请输入内容" style="width:99%"></el-input>
          </el-form-item>
          <el-form-item label="全体作者" prop>
            <el-input
              type="textarea"
              clearable
              v-model="ruleForm.cateNumber"
              placeholder
              style="width:99%"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="normal">确定</el-button>
        <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
      </div>-->
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
      loading: false,
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
    // this.list();
  }
};
</script>

<style>
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.el-autocomplete {
  width: 100%;
}
el-from {
  overflow: auto;
}
</style>