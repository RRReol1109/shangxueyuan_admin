<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="教师:">
          <el-select
            size="normal"
            v-model="query.teacher"
            　filterable
            placeholder="请选择老师"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="query.auditFlag"
            size="normal"
            placeholder="请选择状态"
          >
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-search"
            @click="list"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="
              operate = 'add';
              showDialog();
            "
            >新增</el-button
          >
        </el-form-item>
        <el-form-item label>
          <el-dropdown
            v-if="showFunctionList"
            @command="handleCommand"
            style="float: right"
          >
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item
                command="examine"
                v-if="roleId == 1 || roleId == 19"
                >批量审核</el-dropdown-item
              >
              <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/paper/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
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
      height="600"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column 
        :show-overflow-tooltip="true"
        prop="pick"
        align="center"
        label="选择"
        width="50"
      >
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>-->
      <el-table-column
        sortable
        align="center"
        type="selection"
        width="50"
      ></el-table-column>
      <el-table-column
        sortable
        type="index"
        label="序号"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="year"
        align="center"
        label="年度"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="userName"
        align="center"
        label="教师"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="count"
        align="center"
        label="指导人数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="graduationCount"
        align="center"
        label="毕业人数"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="secretaryCount"
        align="center"
        label="答辩秘书班级数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentType"
        align="center"
        label="学生类型"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="editorName"
        align="center"
        label="录入人"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="auditFlag"
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">
          <span style="color: #409eff">{{
            scope.row.auditFlag | statusFilter
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        fixed="right"
        align="center"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            @click="
              operate = 'show';
              showDialog(scope.row);
            "
            type="text"
            size="normal"
            >查看</el-button
          >
          <el-button
            @click="
              operate = 'edit';
              showDialog(scope.row);
            "
            type="text"
            size="normal"
            >编辑</el-button
          >
          <el-button @click="del(scope.row)" type="text" size="normal"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px">
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
    <el-dialog
      width="35%"
      style="min-height: 500px"
      title="批量审核操作"
      :visible.sync="examineDialog"
    >
      <el-row>
        <el-col :span="8">
          <el-button
            @click="examineDialog = false"
            size="normal"
            style="width: 97%"
            >取 消</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="examineData('success')"
            size="normal"
            style="width: 97%"
            >通过</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-button
            type="danger"
            @click="examineData('failed')"
            size="normal"
            style="width: 97%"
            >不通过</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
    <el-drawer
      size="60%"
      style="min-height: 500px"
      title
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px">
          <el-button @click="dialogFormVisible = false" size="normal"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            size="normal"
            >保存</el-button
          >
          <el-button size="normal" @click="resetForm('ruleForm')"
            >重置</el-button
          >
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
            <el-form-item label="年度" prop="year">
              <el-date-picker
                size="normal"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
                style="width: 99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="showTeachInput" label="教师" prop="teacher">
              <el-select
                v-model="ruleForm.teacher"
                　filterable
                placeholder="请选择老师"
                style="width: 99%"
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="学生类型:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.studentType" size="normal" placeholder="请选择状态">
            <el-option label="本科生" value="本科生"></el-option>
            <el-option label="研究生" value="研究生"></el-option>
            <el-option label="博士生" value="博士生"></el-option>
          </el-select>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="指导人数" prop="count">
              <el-input
                v-model="ruleForm.count"
                oninput="value=value.replace(/[^\d.]/g,'')"
                style="width: 99%"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="实际课时" prop="hours">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.hours"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
            ></el-input>
          </el-col>
            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="答辩秘书班级数" prop="secretaryCount">
              <el-input
                v-model="ruleForm.secretaryCount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
                style="width: 99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生类型:" prop="studentType">
              <el-select
                v-model="ruleForm.studentType"
                size="normal"
                style="width: 99%"
                placeholder="请选择状态"
              >
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="研究生" value="研究生"></el-option>
                <el-option label="博士生" value="博士生"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业人数" prop="graduationCount">
              <el-input
                v-model="ruleForm.graduationCount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
                style="width: 99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="所有学生" prop>
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.cateNumber"
            placeholder
            style="width:99%"
          ></el-input>
          <span style="color:#F56C6C">例子：201301020225-张三-经管2班；201301020221-李四-经管1班；</span>
        </el-form-item> -->
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select
            v-model="ruleForm.auditFlag"
            size="normal"
            placeholder="请选择状态"
            style="width: 99%"
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
import axios from "~/plugins/axios2";
import moment from "moment";
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
      checkedList: [],
      showTeachInput: false,
      showFunctionList: false,
      loading: true,
      total: 0,
      dialogFormVisible: false,
      formDisabled: false,
      header: {},
      courseNames: [],
      fileList: [],
      operate: "",
      page: 1,
      query: { limit: 10, offset: 0, order: "desc", condition: "" },
      yearsOptions: [],
      tableData: [{}],
      ruleForm: {
        year: "",
        teacher: "1",
        count: 0,
        graduationCount: 0,
        secretaryCount: 0,
        auditFlag: "",
      },
      role: false,
      rules: {
        secretaryCount: [
          { required: true, message: "请输班级数", trigger: "blur" },
          // { validator: validateNumber, trigger: "blur" }
        ],
        teacher: [{ required: true, message: "请选择老师", trigger: "blur" }],
        studentType: [
          { required: true, message: "请选择学生类型", trigger: "blur" },
        ],
        year: [
          { required: true, message: "请输入年份", trigger: "blur" },
          // { validator: validateNumber, trigger: "blur" }
        ],
        count: [
          { required: true, message: "请输人数", trigger: "blur" },
          // { validator: validateNumber, trigger: "blur" }
        ],
        graduationCount: [
          { required: true, message: "请输人数", trigger: "blur" },
          // { validator: validateNumber, trigger: "blur" }
        ],
      },
      yearsOptions: [],
      examineDialog: false,
      pick: false,
      examineForm: {
        auditFlag: "0",
      },
      roleId: 0,
      teacherList: [],
    };
  },
  filters: {
    statusFilter: function (value) {
      let test = { 0: "未审核", 1: "已审核", 2: "未通过" };
      console.log(test);
      if (!isNaN(parseInt(value))) {
        return test[value.toString()];
      }
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    async list() {
      this.loading = true;
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = localStorage.getItem("userId");
        this.role = false;
      } else {
        this.role = true;
      }
      let query = this.query;
      console.log(this.query.teacher);
      let res = await axios.$post("/paper/list", query);
      this.tableData = res.rows;
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        for (let j = 0; j < this.teacherList.length; j++) {
          const teacher = this.teacherList[j];
          if (element.teacher == teacher.id) {
            element.teacher = teacher.name;
          }
        }
      }
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/paper/export?id=-1", {});
      } else {
        data = await axios.$download("/paper/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作量-论文指导.xls");
        document.body.appendChild(link);
        link.click();
      }
    },

    changeSize(val) {
      this.query.limit = val;
      this.list();
    },

    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
    },
    async submitForm(formName) {
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
      switch (this.operate) {
        case "add":
          if (this.loginUserId) {
            this.ruleForm.teacher = this.loginUserId;
          }
          if (this.teacherList.length == 0) {
            this.teacherList = await axios.$get("/mgr/quicklist", {});
          }
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id;
            }
          }
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];
              if (!element && key != "auditFlag" && parseInt(element) != 0) {
                console.log(element, "==========element===" + key);
                this.$message({
                  type: "info",
                  message: "请填写正确数据",
                });
                return;
              }
            }
          }
          if (this.roleId == 1 || this.roleId == 19) {
            this.ruleForm.auditFlag = "1";
          }
          await axios.$post("/paper/add", this.ruleForm);
          break;
        case "edit":
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id.toString();
            }
          }
          await axios.$post("/paper/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;

      await this.list();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
          year: "",
          // teacher: "",
          count: 0,
          graduationCount: 0,
          secretaryCount: 0,
          auditFlag: "0",
          teacher: "",
          studentType: "",
          editor: JSON.parse(localStorage.getItem("userInfo")).id,
        };
        if (this.roles.indexOf(888) == -1) {
          this.ruleForm.teacher = localStorage.getItem("userId");
        }
      } else {
        this.ruleForm = row;
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let paperId = row.id;
          await axios.$post("/paper/delete", {
            paperId: paperId,
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
    async queryTeacher(queryString, cb) {
      console.log(queryString);
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString,
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
      return (teacher) => {
        return (
          teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
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
            await axios.$post("/paper/delete", {
              paperId: vm.checkedList[i].id,
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
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
          await axios.$post("/paper/update", this.examineForm);
        } else {
          this.examineForm.auditFlag = 2;
          await axios.$post("/paper/update", this.examineForm);
        }
      }
      this.$message({
        type: "success",
        message: "审核成功!",
      });
      this.examineDialog = false;
      this.list();
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
  },
  async mounted() {
    this.checkCanUse();
    this.list();
    this.header = {
      Authorization: localStorage.getItem("message"),
    };
    this.teacherList = await axios.$get("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999,
    });
    this.teacherList = this.teacherList.rows;
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i,
      });
    }
    this.roleId = localStorage.getItem("roleId");
  },
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
</style>