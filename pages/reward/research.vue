<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>-->
        <el-form-item label="项目类别:">
          <el-select v-model="query.type" size="normal" placeholder="请选择类别">
            <el-option label="全部" value></el-option>
            <el-option label="国家自然科学基金" value="国家自然科学基金"></el-option>
            <el-option label="国家社会科学基金" value="国家社会科学基金"></el-option>
            <el-option label="国家软科学研究计划项目" value="国家软科学研究计划项目"></el-option>
            <el-option label="国家 973 项目" value="国家 973 项目"></el-option>
            <el-option label="国家科技支撑计划项目" value="国家科技支撑计划项目"></el-option>
            <el-option label="教育部立项的各类纵向项目" value="教育部立项的各类纵向项目"></el-option>
            <el-option label="部委项目" value="部委项目"></el-option>
            <el-option label="省级立项的纵向项目" value="省级立项的纵向项目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称:">
          <el-input v-model="query.projectName" placeholder="请输入项目名称" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="项目级别:">
          <el-select v-model="query.level" size="normal" placeholder="请选择级别">
            <el-option label="全部" value></el-option>
            <el-option label="重大项目" value="重大项目"></el-option>
            <el-option label="重点项目" value="重点项目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="query.startDate" type="date" placeholder="选择日期时间" size="normal"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="query.endDate" type="date" placeholder="选择日期时间" size="normal"></el-date-picker>
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
                  action="http://bs.hk.darkal.cn/project/upload?token='AuthenticationToken'"
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
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="项目类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level" align="center" label="项目级别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="projectName" align="center" label="项目名称"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="projectFunds"
        align="center"
        label="直接经费"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="项目主持人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startDate" align="center" label="开始时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="endDate" align="center" label="结束时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
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
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="年度:" prop="year">
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
        <el-form-item label="项目类型" prop="type">
          <el-select
            v-model="ruleForm.type"
            placeholder="请选择类型"
            @change="typeChage"
            style="width:99%"
          >
            <el-option label="国家自然科学基金" value="国家自然科学基金"></el-option>
            <el-option label="国家社会科学基金" value="国家社会科学基金"></el-option>
            <el-option label="国家软科学研究计划项目" value="国家软科学研究计划项目"></el-option>
            <el-option label="国家 973 项目" value="国家 973 项目"></el-option>
            <el-option label="国家科技支撑计划项目" value="国家科技支撑计划项目"></el-option>
            <el-option label="教育部立项的各类纵向项目" value="教育部立项的各类纵向项目"></el-option>
            <el-option label="部委项目" value="部委项目"></el-option>
            <el-option label="省级立项的纵向项目" value="省级立项的纵向项目"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他" v-if="elFlag">
          <el-input v-model="ruleForm.typeF" clearable style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目级别" prop="level">
              <el-select v-model="ruleForm.level" placeholder="请选择级别" style="width:99%">
                <el-option label="重点项目" value="重点项目"></el-option>
                <el-option label="重大项目" value="重大项目"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-autocomplete
                clearable
                style="width:99%"
                v-model="ruleForm.projectName"
                :fetch-suggestions="queryProjects"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="直接经费" prop="projectFunds">
              <el-input
                style="width:99%"
                clearable
                v-model="ruleForm.projectFunds"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目主持人" prop="teacher">
              <el-select
                v-model="ruleForm.teacher"
                filterable　placeholder="请选择老师"
                style="width:99%"
              >
                <el-option
                  style="width:99%"
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="附件" prop="files">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="fileUploadSuccess"
            action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="开始时间">
              <el-date-picker
                v-model="ruleForm.startDate"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="结束时间">
              <el-date-picker
                v-model="ruleForm.endDate"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-divider content-position="left">附件</el-divider>
          <el-table
            :data="additionFiles"
            border
            style="width: 100%"
            size="normal"
            header-row-class-name="h30"
            header-cell-class-name="tc-g2 bc-g"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              type="index"
              label="#"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop label="文件名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name.split('/').pop() }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="downloadAdditionFile(scope.row)" type="primary" size="mini">下载</el-button>
                <el-button @click="deleteAdditionFile(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-upload
            class="dragger"
            :show-file-list="false"
            :on-success="uploadAdditionSuccess"
            drag
            :headers="header"
            action="http://bs.hk.darkal.cn/mgr/upload"
            multiple
          >
            <div class="el-upload__tip" slot="tip"></div>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
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
      fileLoading: false,
      fileData: "",
      action: "",
      examineDialog: false,
      loading: false,
      tableData: [],
      header: {},
      deptid: "",
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
      additionFiles: [],
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
      checkedList: [],
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
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    }
  },
  methods: {
    async uploadAdditionSuccess(response) {
      console.log("this.ruleForm:::", this.ruleForm);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.ruleForm.files = JSON.stringify(this.additionFiles);
          await axios.$post("/project/update", this.ruleForm);
        }
      }
    },
    downloadAdditionFile(row) {
      window.open(row.name);
    },
    async deleteAdditionFile(row) {
      this.additionFiles = this.additionFiles.filter(
        it => it.name !== row.name
      );
      if (this.operate == "edit") {
        this.ruleForm.files = JSON.stringify(this.additionFiles);
        await axios.$post("/project/update", this.ruleForm);
      }
    },
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
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/project/export?id=-1", {});
      } else {
        data = await axios.$download("/project/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-科研项目.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      this.ruleForm.files = JSON.stringify(this.additionFiles);
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
      if (this.additionFiles)
        this.ruleForm.files = JSON.stringify(this.additionFiles);
      switch (this.operate) {
        case "add":
          this.ruleForm.files = this.fileurl;
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
      this.$message({
        type: "success",
        message: "上传成功"
      });
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
        this.additionFiles = [];
      } else {
        this.ruleForm = row;
        if (row.files) this.additionFiles = JSON.parse(row.files);
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
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
          this.exportData(command);
          break;
        case "examine":
          if (this.checkedList.length <= 0) {
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
      let vm = this;
      if (this.checkedList.length == 0) {
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
          for (let i = 0; i < vm.checkedList.length; i++) {
            await axios.$post("/project/delete", {
              projectId: vm.checkedList[i].id
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

    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
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
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.list();
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>

<style>
.el-autocomplete {
  width: 100%;
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