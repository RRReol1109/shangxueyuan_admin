<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="normal"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="入学年月:">
          <el-date-picker
            v-model="query.startDate"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="normal"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业年月:">
          <el-date-picker
            v-model="query.startDate"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="normal"
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
                  action="http://bs.hk.darkal.cn/recruit/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="index" align="center" label="序号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startDate" align="center" label="入学年月"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="graduateDate"
        align="center"
        label="毕业年月"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studentCnt" align="center" label="学员人数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="graduateCnt" align="center" label="毕业人数"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fulltimeCnt"
        align="center"
        label="全日制人数"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="parttimeCnt"
        align="center"
        label="非全日制人数"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="origin" align="center" label="学员来源"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="requestCnt" align="center" label="申请人数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="acceptedCnt" align="center" label="录取人数"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="acceptedRate"
        align="center"
        label="录取比例"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="degreeCnt" align="center" label="授予学位人数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="leaveCnt" align="center" label="分流淘汰人员"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
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

    <el-drawer
      style="min-height:500px"
      title="通讯录"
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
        label-width="150px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份:">
              <el-date-picker
                v-model="form.year"
                align="right"
                size="normal"
                type="date"
                format="yyyy"
                value-format="yyyy"
                placeholder="年份"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input size="normal" v-model="form.name" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学号">
              <el-input size="normal" v-model="form.index" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入学年月:">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                size="normal"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="毕业年月:">
              <el-date-picker
                v-model="form.graduateDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                size="normal"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学员人数" prop="studentCnt">
              <el-input
                size="normal"
                v-model="form.studentCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="12">
            <el-form-item label="全日制人数" prop="fulltimeCnt">
              <el-input
                size="normal"
                v-model="form.fulltimeCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="非全日制人数" prop="parttimeCnt">
              <el-input
                size="normal"
                v-model="form.parttimeCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学员来源" prop="origin">
              <el-input size="normal" v-model="form.origin" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人数" prop="requestCnt">
              <el-input
                size="normal"
                v-model="form.requestCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录取人数" prop="acceptedCnt">
              <el-input
                size="normal"
                v-model="form.acceptedCnt"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授予学位人数" prop="degreeCnt">
              <el-input size="normal" v-model="form.degreeCnt" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分流淘汰人员" prop="leaveCnt">
              <el-input size="normal" v-model="form.leaveCnt" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item size="normal" label="备注">
          <el-input v-model="form.remark" autocomplete="off" style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态" style="width:99%">
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
        index: "",
        startDate: "",
        year: "2019",
        graduateDate: "",
        studentCnt: "",
        graduateCnt: "",
        fulltimeCnt: "",
        parttimeCnt: "",
        origin: "",
        requestCnt: "",
        acceptedCnt: "",
        degreeCnt: "",
        leaveCnt: ""
      },
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      header: {},
      fileList: [],
      teacherList: [],
      form: {
        index: "",
        startDate: "",
        year: "2019",
        graduateDate: "",
        studentCnt: "",
        graduateCnt: "",
        fulltimeCnt: "",
        parttimeCnt: "",
        origin: "",
        requestCnt: "",
        acceptedCnt: "",
        degreeCnt: "",
        leaveCnt: "",
        acceptedRate: "",
        remark: ""
      },
      tableData: [],
      rules: {}
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
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
      let res = await axios.$post("/recruit/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async submitForm(formName) {
      console.log("submitForm");
      let verification = false;
      this.$refs[formName].validate(valid => {
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
          message: "请填写正确数据"
        });
        return;
      }
      switch (this.operate) {
        case "add":
          console.log("add");
          if (this.form.acceptedCnt)
            this.form.acceptedRate = (
              (this.form.acceptedCnt / this.form.requestCnt) *
              100
            ).toFixed(2);
          console.log(this.form.acceptedRate);

          await axios.$post("/recruit/add", this.form);
          break;
        case "edit":
          await axios.$post("/recruit/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          id: "",
          name: "",
          gender: "",
          year: "",
          college: "",
          trainingLevel: "",
          firstLevelCategory: "",
          projectName: "",
          funding: "",
          remark: ""
        };
      } else {
        this.form = row;
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
          let recruitId = row.id;
          await axios.$post("/recruit/delete", {
            recruitId: recruitId
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
    async changeFlag(row) {
      row.pick = !row.pick;
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
        await axios.$post("/recruit/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
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
          location.href = "http://bsoa.csu.edu.cn/excel-model/sjk-txl.xls";
          break;
        case "download":
          this.exportData();
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

    async exportData() {
      let data = await axios.$download("/recruit/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-txl.xls");
        document.body.appendChild(link);
        link.click();
      }
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
            let recruitId = element.id;
            await axios.$post("/recruit/delete", {
              recruitId: recruitId
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
    }
  },
  mounted() {
    this.list();
  }
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