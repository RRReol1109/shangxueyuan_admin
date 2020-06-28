
<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="校内专业代码:">
          <el-input v-model="query.schoolMajorCode" placeholder="请输入项目名称" size="normal"></el-input>
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
                  action="http://bs.hk.darkal.cn/undergraduateMajorInfomation/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传数据</el-button>
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
      <el-table-column
        :show-overflow-tooltip="true"
        prop="schoolMajorCode"
        align="center"
        label="校内专业代码"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="schoolMajorName"
        align="center"
        label="校内专业名称"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="majorName" align="center" label="专业名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="majorCode" align="center" label="专业代码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="codeVersion" align="center" label="代码版本"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="deptName" align="center" label="所属单位名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="deptCode" align="center" label="所属单位号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="majorYear" align="center" label="专业设置年份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studyLength" align="center" label="学制"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="maxStudyLength"
        align="center"
        label="允许修业年限"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="degreeCategory"
        align="center"
        label="授予学位门类"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="enrollmentStatus"
        align="center"
        label="招生状态"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="newFlag" align="center" label="是否新专业">
        <template slot-scope="scope">
          <span>{{scope.row.newFlag | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="teacherFlag"
        align="center"
        label="是否师范类专业"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
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

        <el-row>
          <el-col :span="12">
            <el-form-item label="校内专业代码" prop="schoolMajorCode">
              <el-input v-model="ruleForm.schoolMajorCode" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校内专业名称" prop="schoolMajorName">
              <el-input v-model="ruleForm.schoolMajorName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="专业名称" prop="persons">
          <el-col :span="12">
            <label>作者姓名-单位</label>
            <el-input v-model="ruleForm.persons" rows="5" type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="ruleForm.majorName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属单位名称" prop="deptName">
              <el-input v-model="ruleForm.deptName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业代码" prop="majorCode">
              <el-input v-model="ruleForm.majorCode" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码版本" prop="codeVersion">
              <el-autocomplete
                style="width:99%"
                clearable
                v-model="ruleForm.codeVersion"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业设置年份" prop="majorYear">
              <!-- -->
              <el-date-picker
                size="normal"
                style="width:99%"
                v-model="ruleForm.majorYear"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学制" prop="studyLength">
              <el-input v-model="ruleForm.studyLength" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位号" prop="deptCode">
              <el-autocomplete
                style="width:99%"
                clearable
                v-model="ruleForm.deptCode"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="所属单位名称" prop="score">
              <el-input v-model="ruleForm.score" style="width:99%"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="允许修业年限" prop="maxStudyLength">
              <el-input v-model="ruleForm.maxStudyLength" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授予学位门类" prop="degreeCategory">
              <el-input v-model="ruleForm.degreeCategory" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="招生状态" prop="enrollmentStatus">
              <el-input v-model="ruleForm.enrollmentStatus" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否新专业" prop="newFlag">
              <el-select
                v-model="ruleForm.newFlag"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否师范类专业" prop="teacherFlag">
              <el-select
                v-model="ruleForm.teacherFlag"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <er-row>
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
        </er-row>
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
      loading: true,
      yearsOptions: [],
      roleId: 0,
      examineDialog: false,
      fileList: [],
      operate: "",
      fileurl: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      deptid: "",
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      header: {},
      tableData: [],
      teacherArr: [
        {
          name: "",
          num: ""
        }
      ],
      ruleForm: {
        type: "1",
        // level: "1",
        resultName: "",
        persons: "",
        score: "",
        awardDate: moment().format("YYYY-MM-DD")
      },
      rules: {
        persons: [{ required: true, message: "请输入作者", trigger: "blur" }],
        resultName: [
          { required: true, message: "请输入项目类别", trigger: "blur" }
        ],
        score: [{ required: true, message: "请输入分数", trigger: "blur" }],
        type: [{ required: true, message: "请输选择类型", trigger: "blur" }]
      },
      rewardNames: []
    };
  },
  mounted() {
    this.resultName = localStorage.getItem("resultName")
      ? JSON.parse(localStorage.getItem("resultName"))
      : [];
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    },
    flagFilter: function(value) {
      if (value != undefined) {
        return {
          true: "是",
          false: "否"
        }[value.toString()];
      }
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.rewardNames.push({
        value: this.ruleForm.resultName
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
      return rewardNames => {
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
    addAwardees() {
      this.ruleForm.persons.push({
        value: "",
        key: Date.now() + "persons"
      });
    },
    removeAwardees(item) {
      var index = this.ruleForm.persons.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.persons.splice(index, 1);
      }
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
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
      let res = await axios.$post(
        "/undergraduateMajorInfomation/list",
        this.query
      );
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async exportData() {
      let data = await axios.$download("/undergraduateMajorInfomation/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.el-input("download", "科研奖励-要报.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    removeTeacher(item) {
      console.log(item);
      var index = this.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.teacherArr.splice(index, 1);
      }
    },
    addTeacher() {
      this.teacherArr.push({
        name: "",
        num: ""
      });
    },
    async submitForm(formName) {
      this.ruleForm.persons = "";
      for (let i = 0; i < this.teacherArr.length; i++) {
        let element = this.teacherArr[i];
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            let info = element[key];
            console.log(info);
            if (key == "name") {
              let names = "";
              for (let j = 0; j < this.teacherList.length; j++) {
                const item = this.teacherList[j];
                if (item.id == info) {
                  console.log(item);
                  names = item.name;
                }
              }
              if (names) this.ruleForm.persons += names;
              else this.ruleForm.persons += info;
            }
            if (key == "num") {
              this.ruleForm.persons += "|" + info + ",";
            }
          }
        }
        if (i == this.teacherArr.length - 1) {
          this.ruleForm.persons = this.ruleForm.persons.substr(
            0,
            this.ruleForm.persons.length - 1
          );
        }
      }
      let verification = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          verification = true;
          console.log("success");
          return true;
        } else {
          verification = false;
          this.ruleForm.persons = "";
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
          await axios.$post("/undergraduateMajorInfomation/add", this.ruleForm);
          break;
        case "edit":
          await axios.$post(
            "/undergraduateMajorInfomation/update",
            this.ruleForm
          );
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
          type: "",
          // level: "",
          resultName: "",
          persons: "",
          score: "",
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        this.teacherArr = [
          {
            name: "",
            num: ""
          }
        ];
      } else {
        this.ruleForm = row;
        this.teacherArr = [];
        this.ruleForm.newFlag = this.ruleForm.newFlag.toString();
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
          let undergraduateMajorInfomationId = row.id;
          await axios.$post("/undergraduateMajorInfomation/delete", {
            undergraduateMajorInfomationId: undergraduateMajorInfomationId
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
          location.href =
            "http://bsoa.csu.edu.cn/excel-model/科研奖励-要报.xls";
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
            let undergraduateMajorInfomationId = element.id;
            await axios.$post("/undergraduateMajorInfomation/delete", {
              undergraduateMajorInfomationId: undergraduateMajorInfomationId
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
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999
      });
      this.teacherList = this.teacherList.rows;
    },
    async examineData(flag) {
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
        console.log(element.auditFlag, "=======" + flag);
        this.examineForm.id = element.id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post(
          "/undergraduateMajorInfomation/update",
          this.examineForm
        );
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
    this.list();
    await this.queryTeacher();
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
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