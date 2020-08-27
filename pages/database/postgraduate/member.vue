<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="专业代码:">
          <el-input v-model="query.majorCode" placeholder="请输入专业代码" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.studentNumber" placeholder="请输入学号" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名:">
          <el-input v-model="query.studentName" placeholder="请输入姓名" size="normal"></el-input>
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
                  action="http://bs.hk.darkal.cn/graduateParty/upload?token='AuthenticationToken'"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column sortable align="center" type="selection" width="50"></el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="departmentName"
        align="center"
        label="院系名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="departmentCode"
        align="center"
        label="院系代码"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="majorName"
        align="center"
        label="专业名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="majorCode"
        align="center"
        label="专业代码"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentNumber"
        align="center"
        label="学号"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="studentName"
        align="center"
        label="学生姓名"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="partyMember"
        align="center"
        label="是否为预备党员"
      >
        <template slot-scope="scope">
          <span>{{scope.row.partyMember | reformPaperFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="idNum"
        align="center"
        label="入党时间"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
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
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
      size="60%"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('form')">重置</el-button>
        </div>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        label-width="180px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="院系名称" prop="departmentName">
              <el-input size="normal" v-model="form.departmentName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="院系代码" prop="departmentCode">
              <el-input size="normal" v-model="form.departmentCode" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业名称" prop="majorName">
              <el-input size="normal" v-model="form.majorName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业代码" prop="majorCode">
              <el-input size="normal" v-model="form.majorCode" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNumber">
              <el-input size="normal" v-model="form.studentNumber" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input size="normal" v-model="form.studentName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否为预备党员" prop="partyMember">
              <el-select
                v-model="form.partyMember"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入党时间" prop="idNum">
              <el-date-picker
                size="normal"
                v-model="form.year"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择年份"
                style="width:98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态" style="width:99%">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
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
  components: {},
  data() {
    return {
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      fileList: [],
      checkedList: [],
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: "",
      },
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      header: {},
      rules: {},
      form: {
        college: "",
        gender: "",
        nativePlace: "",
        nation: "",
        political: "",
        idNum: "",
        startDate: "",
        address: "",
        state: "",
        editorDeptName: "",
        title: "",
        titleDate: "",
        level: "",
        tutor: "",
        personType: "",
        postDate: "",
        highEducation: "",
        highDegree: "",
        school: "",
        college: "",
        startDate: "",
        qq: "",
        phone: "",
        homePhone: "",
        email: "",
      },
      tableData: [],
    };
  },
  filters: {
    statusFilter: function (value) {
      return {
        "0": "未审核",
        "1": "通过",
        "2": "未通过",
      }[value.toString()];
    },
    reformPaperFilter: function (value) {
      if (value != undefined) {
        return {
          true: "是",
          false: "否",
        }[value.toString()];
      }
    },
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async list() {
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "entryTime" || key == "graduationTime") {
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
        this.query.editor = user.id;
      }
      let res = await axios.$post("/graduateParty/list", this.query);
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          const element = res.rows[i];
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const item = element[key];
              if (key == "entryTime" || key == "graduationTime") {
                element[key] = moment(item).format("YYYY-MM-DD");
                console.log(element[key]);
              }
            }
          }
        }
      }
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
    },
    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/graduateParty/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!",
      });
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
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
      switch (this.operate) {
        case "add":
          await axios.$post("/graduateParty/add", this.form);
          break;
        case "edit":
          await axios.$post("/graduateParty/update", this.form);
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
          type: "warning",
        }).then(async () => {});
        return;
      }
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          college: "",
          gender: "",
          nativePlace: "",
          nation: "",
          political: "",
          idNum: "",
          startDate: "",
          address: "",
          state: "",
          editorDeptName: "",
          title: "",
          titleDate: "",
          level: "",
          tutor: "",
          personType: "",
          postDate: "",
          highEducation: "",
          highDegree: "",
          school: "",
          college: "",
          startDate: "",
          qq: "",
          phone: "",
          homePhone: "",
          email: "",
        };
      } else {
        row.auditFlag = row.auditFlag.toString();
        this.form = row;
      }
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
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
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/graduateParty/export?id=-1", {});
      } else {
        data = await axios.$download("/graduateParty/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "数据库-学生党员情况.xls");
        document.body.appendChild(link);
        link.click();
      }
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
            await axios.$post("/graduateParty/delete", {
              graduatePartyId: vm.checkedList[i].id,
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

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let graduatePartyId = row.id;
          await axios.$post("/graduateParty/delete", {
            graduatePartyId: graduatePartyId,
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
  },
  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999,
    });
    this.teacherList = this.teacherList.rows;
    this.roleId = localStorage.getItem("roleId");
    this.list();
  },
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
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