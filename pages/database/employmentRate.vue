<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="届别:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="normal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="年度"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入专业" size="normal"></el-input>
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
                  action="http://bs.hk.darkal.cn/graduateRate/upload?token='AuthenticationToken'"
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
      <el-table-column sortable fixed prop="year" align="center" label="届别"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="major"
        align="center"
        label="专业"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="graduateCnt"
        align="center"
        label="毕业人数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="finishedCnt"
        align="center"
        label="就业人数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="degreeCnt"
        align="center"
        label="有学位"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="degreeRate"
        align="center"
        label="就业单位"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="graduateRate"
        align="center"
        label="就业率"
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
      style="min-height:500px"
      title="毕业率"
      size="60%"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
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
        <div slot="title" class="header-title">
          <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
            <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
            <el-button type="primary" @click="submitForm('form')" size="normal">保存</el-button>
            <el-button size="normal" @click="resetForm('form')">重置</el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="届别" prop="year">
              <el-date-picker
                v-model="form.year"
                align="right"
                size="normal"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="年度"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业生人数" prop="totalCnt">
              <el-input size="normal" v-model="form.totalCnt" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input size="normal" v-model="form.major" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业人数" prop="graduateCnt">
              <el-input
                size="normal"
                v-model="form.graduateCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结业人数" prop="finishedCnt">
              <el-input
                size="normal"
                v-model="form.finishedCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有学位" prop="degreeCnt">
              <el-input size="normal" v-model="form.degreeCnt" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      total: 0,
      page: 1,
      operate: "",
      dialogFormVisible: false,
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: "",
      },
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      checkedList: [],
      form: {
        // year: "2019",
        id: "",
        major: "",
        totalCnt: "",
        graduateCnt: "",
        finishedCnt: "",
        degreeCnt: "",
      },
      fileList: [],
      header: {},
      rules: {
        year: [{ required: true, message: "请输入界别", trigger: "blur" }],
        major: [{ required: true, message: "请输入专业", trigger: "blur" }],
        totalCnt: [
          { required: true, message: "请输入毕业生人数", trigger: "blur" },
        ],
        graduateCnt: [
          { required: true, message: "请输入毕业人数", trigger: "blur" },
        ],
        finishedCnt: [
          { required: true, message: "请输入结业人数", trigger: "blur" },
        ],
        degreeCnt: [
          { required: true, message: "请输入有学位", trigger: "blur" },
        ],
      },
      tableData: [],
    };
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
    handleClick(row) {
      console.log(row);
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    async list() {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("userInfo");
      if (user.roleid == 7) {
        this.query.editor = user.id;
      }
      let res = await axios.$post("/graduateRate/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
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
      this.form.graduateRate =
        ((this.form.graduateCnt / this.form.totalCnt) * 100).toFixed(2) + "%";
      this.form.degreeRate =
        ((this.form.degreeCnt / this.form.totalCnt) * 100).toFixed(2) + "%";
      switch (this.operate) {
        case "add":
          await axios.$post("/graduateRate/add", this.form);
          break;
        case "edit":
          await axios.$post("/graduateRate/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },

    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/graduateRate/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!",
      });
    },

    async handleCommand(command) {
      console.log(command);
      switch (command) {
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
        case "download":
          this.exportData(command);
          break;
      }
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
    },

    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/graduateRate/export?id=-1", {});
      } else {
        data = await axios.$download("/graduateRate/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "数据库-毕业率.xls");
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
            await axios.$post("/graduateRate/delete", {
              graduateRateId: vm.checkedList[i].id,
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
          id: "",
          major: "",
          totalCnt: "",
          graduateCnt: "",
          finishedCnt: "",
          degreeCnt: "",
        };
      } else {
        this.form = row;
      }
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let graduateRateId = row.id;
          await axios.$post("/graduateRate/delete", {
            graduateRateId: graduateRateId,
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
  mounted() {
    this.roleId = localStorage.getItem("roleId");
    this.header = {
      Authorization: localStorage.getItem("message"),
    };
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