<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
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
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="学院:">
          <el-input v-model="query.college" placeholder="请输入学院" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="一级学科:">
          <el-input v-model="query.firstLevelCategory" placeholder="请输入学科" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="项目名称:">
          <el-input v-model="query.projectName" placeholder="请输入项目名称" size="normal"></el-input>
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
              <!-- <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>-->
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1||roleId==19">批量审核</el-dropdown-item>
              <!-- <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
:file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/simulation/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>-->
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
      <!-- <el-table-column sortable fixed prop="id" align="center" label="ID"></el-table-column> -->
      <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="gender"
        align="center"
        label="性别"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="college"
        align="center"
        label="学院"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="firstLevelCategory"
        align="center"
        label="一级学科"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="trainingLevel"
        align="center"
        label="培养层次"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="projectName"
        align="center"
        label="项目名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="funding"
        align="center"
        label="经费（万元）"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="remark"
        align="center"
        label="备注"
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
      :visible.sync="dialogFormVisible"
      size="60%"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input size="normal" v-model="form.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="学号" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
            </el-form-item>-->
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" size="normal" placeholder="性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度:" prop="year">
              <el-date-picker
                v-model="form.year"
                align="right"
                size="normal"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="年度"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="学院" prop="college">
              <el-input size="normal" v-model="form.college" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级学科" prop="firstLevelCategory">
              <el-input size="normal" v-model="form.firstLevelCategory" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="培养层次" prop="trainingLevel">
              <el-input size="normal" v-model="form.trainingLevel" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input size="normal" v-model="form.projectName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="经费（万元）" prop="funding">
              <el-input size="normal" v-model="form.funding" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="毕业学校">
          <el-col :span="6">
            <el-input size="normal" v-model="form.graduationSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业">
          <el-col :span="6">
            <el-input size="normal" v-model="form.funding" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-form-item size="normal" label="备注" prop="remark">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
            <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态" style="width:99%">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
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
      form: {
        id: "",
        name: "",
        gender: "",
        year: "",
        college: "",
        trainingLevel: "",
        firstLevelCategory: "",
        projectName: "",
        funding: "",
        remark: "",
      },
      roleId: 0,
      checkedList: [],
      examineDialog: false,
      examineForm: {},
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
        college: [{ required: true, message: "请输入学院", trigger: "blur" }],
        trainingLevel: [
          { required: true, message: "请输入培养层次", trigger: "blur" },
        ],
        firstLevelCategory: [
          { required: true, message: "请输入一级学科", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        funding: [{ required: true, message: "请输入经费", trigger: "blur" }],
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
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
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
      let res = await axios.$post("/teachingReform/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
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
          await axios.$post("/teachingReform/add", this.form);
          break;
        case "edit":
          await axios.$post("/teachingReform/update", this.form);
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
          id: "",
          name: "",
          gender: "",
          year: "",
          college: "",
          trainingLevel: "",
          firstLevelCategory: "",
          projectName: "",
          funding: "",
          remark: "",
        };
      } else {
        this.form = row;
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
          let teachingReformId = row.id;
          await axios.$post("/teachingReform/delete", {
            teachingReformId: teachingReformId,
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
        await axios.$post("/teachingReform/update", this.examineForm);
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
      }
    },

    changeSize(val) {
      this.query.limit = val;
      this.list();
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
            await axios.$post("/teachingReform/delete", {
              teachingReformId: vm.checkedList[i].id,
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
  },
  mounted() {
    this.roleId = localStorage.getItem("roleId");
    this.list();
  },
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>