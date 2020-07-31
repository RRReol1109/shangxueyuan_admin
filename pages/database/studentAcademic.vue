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
                  action="http://bs.hk.darkal.cn/studentAcademic/upload?token='AuthenticationToken'"
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
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentNumber"
        align="center"
        label="学号"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentName"
        align="center"
        label="学生姓名"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="majorClass"
        align="center"
        label="专业班级"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="tutorName"
        align="center"
        label="导师姓名"
        width="150"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="major" align="center" label="系"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="schoolFundingDepartment"
        align="center"
        label="学校资助部门"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="schoolFundingPrice"
        align="center"
        label="学校资助金额"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="collegeFundingDepartment"
        align="center"
        label="学院资助部门"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="collegeFundingPrice"
        align="center"
        label="学院资助金额"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="projectTitle"
        align="center"
        label="课题名称"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="projectId"
        align="center"
        label="课题编号"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="projectType"
        align="center"
        label="课题类型"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="researchCenter"
        align="center"
        label="所属研究中心"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="meetingName"
        align="center"
        label="会议名称(中)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="meetingName"
        align="center"
        label="会议名称(英)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="meetingId"
        align="center"
        label="会议代码"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="meetingContent"
        align="center"
        label="会议情况说明"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="date"
        align="center"
        label="会议时间"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="venue"
        align="center"
        label="会议地点(中)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="venue"
        align="center"
        label="会议地点(英)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="participatingPaper"
        align="center"
        label="参会论文(中)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="participatingPaper"
        align="center"
        label="参会论文(英)"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="reportType"
        align="center"
        label="报告形式"
        width="150"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="content"
        align="center"
        label="报告内容简介"
        width="150"
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
    <el-drawer
      size="60%"
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      @close="closeDrawer"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNumber">
              <el-input clearable v-model="ruleForm.studentNumber" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input clearable v-model="ruleForm.studentName" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业班级" prop="majorClass">
              <el-input clearable v-model="ruleForm.majorClass" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导师姓名" prop="tutorName">
              <el-input clearable v-model="ruleForm.tutorName" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系" prop="major">
              <el-input clearable v-model="ruleForm.major" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校资助部门" prop="schoolFundingDepartment">
              <el-input
                clearable
                v-model="ruleForm.schoolFundingDepartment"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校资助金额" prop="schoolFundingPrice">
              <el-input
                clearable
                v-model="ruleForm.schoolFundingPrice"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学院资助部门" prop="collegeFundingDepartment">
              <el-input
                clearable
                v-model="ruleForm.collegeFundingDepartment"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院资助金额" prop="collegeFundingPrice">
              <el-input
                clearable
                v-model="ruleForm.collegeFundingPrice"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课题名称" prop="projectTitle">
              <el-input clearable v-model="ruleForm.projectTitle" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课题编号" prop="projectId">
              <el-input clearable v-model="ruleForm.projectId" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课题类型" prop="projectType">
              <el-input clearable v-model="ruleForm.projectType" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属研究中心" prop="researchCenter">
              <el-input clearable v-model="ruleForm.researchCenter" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议名称(中)" prop="meetingName">
              <el-input clearable v-model="ruleForm.meetingName" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议名称(英)" prop="meetingName">
              <el-input clearable v-model="ruleForm.meetingName" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议代码" prop="meetingId">
              <el-input clearable v-model="ruleForm.meetingId" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议情况说明" prop="meetingContent">
              <el-input clearable v-model="ruleForm.meetingContent" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议时间" prop="date">
              <el-date-picker
                v-model="ruleForm.date"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议地点(中)" prop="venue">
              <el-input clearable v-model="ruleForm.venue" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议地点(英)" prop="venue">
              <el-input clearable v-model="ruleForm.venue" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参会论文(中)" prop="participatingPaper">
              <el-input
                clearable
                v-model="ruleForm.participatingPaper"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参会论文(英)" prop="participatingPaper">
              <el-input
                clearable
                v-model="ruleForm.participatingPaper"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报告形式" prop="reportType">
              <el-select
                placeholder="请选择"
                style="width:98%"
                v-model="ruleForm.reportType"
                @change="typeChage"
              >
                <el-option label="大会报告" value="大会报告"></el-option>
                <el-option label="分论坛报告" value="分论坛报告"></el-option>
                <el-option label="大会POSTER" value="大会POSTER"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他" v-if="elFlag">
              <el-input v-model="ruleForm.typeF" clearable style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报告内容简介" prop="content">
              <el-input clearable v-model="ruleForm.content" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
      loading: true,
      yearsOptions: [],
      roleId: 0,
      elFlag: false,
      examineDialog: false,
      fileList: [],
      operate: "",
      fileurl: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      deptid: "",
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: "",
      },
      teacherList: [],
      header: {},
      tableData: [],
      checkedList: [],
      ruleForm: {},
      rules: [],
      rewardNames: [],
    };
  },
  mounted() {
    this.resultName = localStorage.getItem("resultName")
      ? JSON.parse(localStorage.getItem("resultName"))
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
    closeDrawer() {
      this.list();
    },
    updataCache() {
      this.rewardNames.push({
        value: this.ruleForm.resultName,
      });
      this.rewardNames = _.uniqWith(this.rewardNames, _.isEqual);
      localStorage.setItem("rewardNames", JSON.stringify(this.rewardNames));
    },
    queryProjects(queryString, cb) {
      var rewardNames = this.rewardNames;
      var results = queryString
        ? rewardNames.filter(this.createProjectsFilter(queryString))
        : rewardNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createProjectsFilter(queryString) {
      return (rewardNames) => {
        return (
          rewardNames.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
    },
    async list() {
      this.loading = true;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "awardDate") {
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
        this.query.editor = localStorage.getItem("userId");
      }
      let res = await axios.$post("/studentAcademic/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },

    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/studentAcademic/export?id=-1", {});
      } else {
        data = await axios.$download("/studentAcademic/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-学科简介.xls");
        document.body.appendChild(link);
        link.click();
      }
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
      if (this.ruleForm.reportType == "其他") {
        this.ruleForm.reportType = this.ruleForm.typeF;
      }
      if (this.ruleForm.date) {
        this.ruleForm.date =
          moment(this.ruleForm.date[0]).format("YYYY-MM-DD") +
          "——" +
          moment(this.ruleForm.date[1]).format("YYYY-MM-DD");
      }
      switch (this.operate) {
        case "add":
          await axios.$post("/studentAcademic/add", this.ruleForm);
          break;
        case "edit":
          console.log(this.ruleForm.date);
          await axios.$post("/studentAcademic/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
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
          editor: JSON.parse(localStorage.getItem("userInfo")).id,
        };
      } else {
        this.ruleForm = row;
        this.ruleForm.date = row.date.split("——");
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    typeChage() {
      console.log(this.ruleForm.reportType, "type");
      if (this.ruleForm.reportType == "其他") {
        this.elFlag = true;
      } else {
        this.elFlag = false;
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
          let studentAcademicId = row.id;
          await axios.$post("/studentAcademic/delete", {
            studentAcademicId: studentAcademicId,
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
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
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
            await axios.$post("/studentAcademic/delete", {
              studentAcademicId: vm.checkedList[i].id,
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
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999,
      });
      this.teacherList = this.teacherList.rows;
    },
    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
          this.$confirm(
            "审核通过之后该条数据将不可修改,请确认是否通过审核?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(async () => {
              await axios.$post("/studentAcademic/update", this.examineForm);
              this.list();
              this.$message({
                type: "success",
                message: "审核成功!",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          this.examineForm.auditFlag = 2;
          await axios.$post("/studentAcademic/update", this.examineForm);
          this.list();
        }
      }
      this.examineDialog = false;
    },
  },

  async mounted() {
    this.list();
    await this.queryTeacher();
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i,
      });
    }
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.roleId = localStorage.getItem("roleId");
  },
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