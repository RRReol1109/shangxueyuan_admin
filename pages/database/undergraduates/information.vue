<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="课程名称:">
          <el-input v-model="query.persons" placeholder="请输入课程名称" size="normal"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label v-if="deptid==31||roleId==1">
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item v-if="deptid==31||roleId==1">
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
                  action="http://bs.hk.darkal.cn/reportResult/upload?token='AuthenticationToken'"
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
      <el-table-column :show-overflow-tooltip="true" prop="awardDate" align="center" label="课程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="persons" align="center" label="课程号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="resultName" align="center" label="项目类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="persons" align="center" label="项目级别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="persons" align="center" label="建设方式"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="150"
        v-if="deptid==31||roleId==1"
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
        label-width="120px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="awardDate">
              <el-input v-model="ruleForm.score" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="awardDate">
              <el-input v-model="ruleForm.score" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="项目级别" prop="persons">
          <el-col :span="12">
            <label>作者姓名-单位</label>
            <el-input v-model="ruleForm.persons" rows="5" type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目级别" prop="awardDate">
              <el-select
                v-model="ruleForm.auditFlag"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="国家级" value="国家级"></el-option>
                <el-option label="省部级" value="省部级"></el-option>
                <el-option label="其他级(含校级)" value="其他级(含校级)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目类别" prop="resultName">
              <el-select
                v-model="ruleForm.auditFlag"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="精品在线开放课程" value="精品在线开放课程"></el-option>
                <el-option label="产学合作协同育人项目" value="产学合作协同育人项目"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建设方式" prop="resultName">
              <el-select
                v-model="ruleForm.auditFlag"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="自建" value="自建"></el-option>
                <el-option label="引进" value="引进"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="证书" prop="file">
          <el-upload class :headers="header" :on-success="uploadSuccess" action>
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>-->
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
      let res = await axios.$post("/reportResult/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async exportData() {
      let data = await axios.$download("/reportResult/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-要报.xls");
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
          await axios.$post("/reportResult/add", this.ruleForm);
          break;
        case "edit":
          await axios.$post("/reportResult/update", this.ruleForm);
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
          awardDate: moment().format("YYYY-MM-DD"),
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
        let teacherInfo = row.persons.split(",");
        for (let i = 0; i < teacherInfo.length; i++) {
          const element = teacherInfo[i];
          this.teacherArr.push({
            name: "",
            num: ""
          });
          let teacher = element.split("|");
          for (let j = 0; j < teacher.length; j++) {
            const item = teacher[j];
            console.log(item, "======item" + j);
            if (j % 2 == 1) {
              this.teacherArr[i].num = item;
            } else if (j % 2 == 0) {
              this.teacherArr[i].name = item;
            }
          }
        }
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
          let reportResultId = row.id;
          await axios.$post("/reportResult/delete", {
            reportResultId: reportResultId
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
            let reportResultId = element.id;
            await axios.$post("/reportResult/delete", {
              reportResultId: reportResultId
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
        await axios.$post("/reportResult/update", this.examineForm);
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