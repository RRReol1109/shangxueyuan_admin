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
            placeholder="年级"
          ></el-date-picker>
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
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float: right">
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
                  action="http://bs.hk.darkal.cn/teacherAward/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" height="600">
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
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
        label="年份"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="id"
        align="center"
        label="教师工号"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="name"
        align="center"
        label="教师姓名"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="entrance"
        align="center"
        label="任务来源"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="student"
        align="center"
        label="研究生课程名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="graduationStudent"
        align="center"
        label="授课对象"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="admission"
        align="center"
        label="实际课时"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="grant"
        align="center"
        label="实际人数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="eliminate"
        align="center"
        label="核定系数"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="eliminate"
        align="center"
        label="工作量"
      ></el-table-column>
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
      style="min-height: 500px"
      title
      size="60%"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px">
          <el-button @click="dialogFormVisible = false" size="normal"
            >取消</el-button
          >
          <el-button type="primary" @click="submitForm('form')" size="normal"
            >保存</el-button
          >
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
            <el-form-item label="年份" prop="year">
              <el-date-picker
                v-model="form.year"
                type="date"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择日期时间"
                size="normal"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师工号" prop="teacherId">
              <el-input size="normal" v-model="form.teacherId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务来源" prop="name">
              <el-select
                v-model="form.awardType"
                size="normal"
                placeholder="请选择"
                style="width: 98%"
              >
                <el-option label="研管安排" value="研管安排"></el-option>
                <el-option label="MBA安排" value="MBA安排"></el-option>
                <el-option label="EMBA安排" value="EMBA安排"></el-option>
                <el-option label="专硕安排" value="专硕安排"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究生课程名称" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课对象" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际课时" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际人数" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="核定系数" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作量" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        id: "",
        entrance: "",
        year: "2019",
        graduation: "",
        student: "",
        graduationStudent: "",
        fullTime: "",
        unfullTime: "",
        source: "",
        apply: "",
        admission: "",
        grant: "",
        eliminate: "",
        admissionRate: "",
      },
      tableData: [],
    };
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
      let res = await axios.$post("/teacherAward/list", this.query);
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
        await axios.$post("/teacherAward/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!",
      });
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
          await axios.$post("/teacherAward/add", this.form);
          break;
        case "edit":
          await axios.$post("/teacherAward/update", this.form);
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
          year: "",
          teacherId: "",
          name: "",
          title: "",
          awardName: "",
          awardLevel: "",
          awardType: "",
          awardOrganize: "",
          awardId: "",
          awardDate: "",
          pdfUrl: "",
          ratio: "",
          point: "",
          score: "",
        };
      } else {
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
        data = await axios.$download("/teacherAward/export?id=-1", {});
      } else {
        data = await axios.$download("/teacherAward/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-lxsxx.xls");
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
          for (let i = 0; i < deleteList.length; i++) {
            const element = deleteList[i];
            let internationalStudentId = element.id;
            await axios.$post("/teacherAward/delete", {
              internationalStudentId: internationalStudentId,
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

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let internationalStudentId = row.id;
          await axios.$post("/teacherAward/delete", {
            internationalStudentId: internationalStudentId,
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