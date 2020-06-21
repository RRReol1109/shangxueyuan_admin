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
          <el-autocomplete
            id="nameBox"
            v-model="query.teacher"
            placeholder="请输入教师"
            :fetch-suggestions="queryTeacher"
            size="normal"
          ></el-autocomplete>
          <!-- </el-select> -->
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="query.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
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
          <el-dropdown v-if="showFunctionList" @command="handleCommand" style="float:right;">
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="role">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/postgraduate/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
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
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="教师"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="研究生类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="count" align="center" label="进校人数"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="graduationCount"
        align="center"
        label="毕业人数"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studentName" align="center" label="学生信息"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="hours" align="center" label="实际课时数"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="editorName" align="center" label="录入人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="desc" align="center" label="备注"></el-table-column> -->
      <el-table-column fixed="right" align="center" label="操作" width="150">
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
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="14"
        :total="this.total"
      ></el-pagination>
    </nav>
    <el-dialog size="60%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="100px"
        class="demo-examineForm"
      >
        <el-row>
          <el-form-item>
            <el-form-item label="审核状态:" v-if="role">
              <el-select
                v-model="examineForm.auditFlag"
                style="width:99%;"
                size="normal"
                placeholder="请选择状态"
              >
                <el-option label="未审核" value="0"></el-option>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="examineDialog = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="examineData('examineForm')" size="normal">确定</el-button>
      </div>
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
        label-width="150px"
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
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="showTeachInput" label="教师" prop="teacher">
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
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究生类别" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类别" style="width:99%">
                <el-option label="学术硕士和会计、金融专业硕士" value="学术硕士和会计、金融专业硕士"></el-option>
                <el-option label="MBA、EMBA" value="MBA、EMBA"></el-option>
                <el-option label="博士" value="博士"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进校人数" prop="count">
              <el-input
                style="width:99%"
                v-model="ruleForm.count"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="毕业人数" prop="graduationCount">
          <el-input
            v-model="ruleForm.graduationCount"
            style="width:99%"
            oninput="value=value.replace(/[^\d.]/g,'')"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="答辩秘书班级数" prop="secretaryCount">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.secretaryCount"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="实际课时" prop="hours">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.hours"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="学生信息：" prop="studentName">
          <label>学号-名字-入学年份-专业-班级-一级学科</label>
          <el-input
            v-model="ruleForm.studentName"
            rows="5"
            type="textarea"
            placeholder
            style="width:99%"
          ></el-input>
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
      showTeachInput: false,
      showFunctionList: false,
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      loading: true,
      examineDialog: false,
      total: 0,
      dialogFormVisible: false,
      header: {},
      formDisabled: false,
      yearsOptions: [],
      fileList: [],
      page: 1,
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      role: false,
      tableData: [],
      operate: "",
      roleId: 0,
      ruleForm: {
        year: "2019",
        type: "博士",
        count: 0,
        graduationCount: 0,
        auditFlag: "0",
        teacherArr: [{ name: "", year: "", dw: "", class: "", xk: "" }]
      },
      teacherList: [],
      rules: {
        count: [
          { required: true, message: "请输入课时", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        type: [{ required: true, message: "请输入学生类别", trigger: "blur" }],
        graduationCount: [
          { required: true, message: "请输入人数", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        teacher: [{ required: true, message: "请输入教师", trigger: "change" }],
        studentName: [
          { required: true, message: "请输入学生信息", trigger: "blur" }
        ]
      },
      yearsOptions: []
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    },
    teacherFilter: async function(value) {
      let teacherList = await axios.$get("/mgr/quicklist", { params: "" });
      let temp = {};
      for (let i = 0; i < teacherList.length; i++) {
        const element = teacherList[i];
        temp[element.id + ""] = element.name;
      }
      console.log(temp);
      return temp[value.toString()];
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
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

      // for (let i = 0; i < this.teacherList.length; i++) {
      //   const element = this.teacherList[i];
      //   console.log(element.name);
      //   if (element.name === this.query.teacher) {
      //     this.query.teacher = element.id;
      //   }
      // }

      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = localStorage.getItem("userId");
        this.role = false;
      } else {
        this.role = true;
      }
      // console.log(this.query, "============role");
      let res = await axios.$post("/postgraduate/list", this.query);
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
        data = await axios.$download("/postgraduate/export?id=-1", {});
      } else {
        data = await axios.$download("/postgraduate/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作量-研究生指导.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    removeTeacher(item) {
      console.log(item);
      var index = this.ruleForm.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.teacherArr.splice(index, 1);
      }
    },
    addTeacher() {
      this.ruleForm.teacherArr.push({
        name: "",
        dw: "",
        year: "",
        class: "",
        xk: ""
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
          this.ruleForm.authors = "";
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
          if (this.loginUserId) {
            this.ruleForm.teacher = this.loginUserId;
          }
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id;
            }
          }
          if (this.roleId == 1 || this.roleId == 19) {
            this.ruleForm.auditFlag = 1;
          }
          await axios.$post("/postgraduate/add", this.ruleForm);
          break;
        case "edit":
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id.toString();
            }
          }
          await axios.$post("/postgraduate/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;

      await this.list();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          year: "2019",
          // teacher: "",
          type: "博士",
          count: 0,
          graduationCount: 0,
          teacher: "",
          studentName: "",
          auditFlag: "0",
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        if (this.role) {
          this.ruleForm.auditFlag = "1";
        }
        if (this.roles.indexOf(888) == -1) {
          this.ruleForm.teacher = localStorage.getItem("userId");
        }
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
          let postgraduateId = row.id;
          await axios.$post("/postgraduate/delete", {
            postgraduateId: postgraduateId
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
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    async queryTeacher(queryString, cb) {
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
          this.exportData(command);
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
            let postgraduateId = element.id;
            await axios.$post("/postgraduate/delete", {
              postgraduateId: postgraduateId
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
        await axios.$post("/postgraduate/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    checkCanUse() {
      this.roles = window.localStorage.getItem("roles")
        ? JSON.parse(window.localStorage.getItem("roles"))
        : [];
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
    }
  },
  async mounted() {
    this.checkCanUse();
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    await this.list();
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.roleId = localStorage.getItem("roleId");
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
</style>