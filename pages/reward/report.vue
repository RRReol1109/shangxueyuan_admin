<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="项目级别:">
          <el-select v-model="query.level" size="normal">
            <el-option label="全部" value></el-option>
            <el-option label="国家级" value="1"></el-option>
            <el-option label="省部级" value="2"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="作者:">
          <el-input v-model="query.persons" placeholder="请输入作者" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="项目类型:">
          <el-select v-model="query.type" size="normal" placeholder="请选择类型">
            <el-option label="全部" value></el-option>
            <el-option label="国家课题结题评优" value="1"></el-option>
            <el-option label="湖南省自然科学奖" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="第一完成单位：">
          <el-input v-model="query.persons" placeholder="请输入作者"  size="normal"></el-input>
        </el-form-item>
        <el-form-item label="第一获奖人:">
          <el-input v-model="query.score" placeholder="请输入毕业专业"  size="normal"></el-input>
        </el-form-item>-->
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
        prop="awardDate"
        align="center"
        label="发表时间"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="type"
        align="center"
        label="要报类型"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="resultName"
        align="center"
        label="成果名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="persons"
        align="center"
        label="作者|分数|单位"
      ></el-table-column>
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="score" align="center" label="获得分数"></el-table-column> -->
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
            v-if="scope.row.auditFlag!=1"
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
        <el-divider content-position="left">基本信息</el-divider>

        <el-row>
          <el-col :span="12">
            <el-form-item label="发表时间" prop="award_date">
              <el-date-picker
                size="normal"
                style="width:99%"
                v-model="ruleForm.awardDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="要报类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类型" style="width:99%">
                <el-option label="国家课题结题评优" value="国家课题结题评优"></el-option>
                <el-option label="湖南省自然科学奖" value="湖南省自然科学奖"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="成果名称" prop="resultName">
          <el-autocomplete
            style="width:99%"
            clearable
            v-model="ruleForm.resultName"
            :fetch-suggestions="queryProjects"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
        <!-- <el-form-item label="作者及单位" prop="persons">
          <el-col :span="12">
            <label>作者姓名-单位</label>
            <el-input v-model="ruleForm.persons" rows="5" type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item
          v-for="(teacherArr, index) in teacherArr"
          :label="'作者信息' + (index+1)"
          :key="teacherArr.key"
          :prop="'teacherArr' + index"
        >
          <el-select v-model="teacherArr.name" 　filterable placeholder="请选择老师" prop="name">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>分数:
          <el-input clearable style="width:120px" v-model="teacherArr.point" placeholder="请输入单位"></el-input>单位:
          <el-input clearable style="width:120px" v-model="teacherArr.num" placeholder="请输入单位"></el-input>
          <el-button type="danger" style="width:100px;" @click="removeTeacher(teacherArr)">删除</el-button>
        </el-form-item>
        <el-form-item v-if="!['show'].includes(operate)">
          <el-button type="primary" @click="addTeacher('ruleForm')">继续添加老师</el-button>
        </el-form-item>
        <!-- <el-form-item label="获得分数" prop="score">
          <el-input v-model="ruleForm.score" style="width:99%"></el-input>
        </el-form-item>-->
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
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      header: {},
      tableData: [],
      checkedList: [],
      teacherArr: [
        {
          name: "",
          point: "",
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
          { required: true, message: "请输入成果名称", trigger: "blur" }
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

    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/reportResult/export?id=-1", {});
      } else {
        data = await axios.$download("/reportResult/export", {
          params: this.query
        });
      }
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
        point: "",
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
              this.ruleForm.persons += info;
            }
            if (key == "point") {
              this.ruleForm.persons += "|" + info;
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
      this.ruleForm.year = this.ruleForm.awardDate
        ? this.ruleForm.awardDate.substr(0, 4)
        : "";
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
    changeSize(val) {
      this.query.limit = val;
      this.list();
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
            point: "",
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
            point: "",
            num: ""
          });
          let teacher = element.split("|");
          for (let j = 0; j < teacher.length; j++) {
            const item = teacher[j];
            console.log(item, "======item" + j);
            if (j % 3 == 1) {
              this.teacherArr[i].point = item;
            } else if (j % 3 == 0) {
              this.teacherArr[i].name = item;
            } else if (j % 3 == 2) {
              this.teacherArr[i].num = item;
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
            await axios.$post("/reportResult/delete", {
              reportResultId: vm.checkedList[i].id
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
              type: "warning"
            }
          )
            .then(async () => {
              await axios.$post("/reportResult/update", this.examineForm);
              this.list();
              this.$message({
                type: "success",
                message: "审核成功!"
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        } else {
          this.examineForm.auditFlag = 2;
          await axios.$post("/reportResult/update", this.examineForm);
          this.list();
        }
      }
      this.examineDialog = false;
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