<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-date-picker
            v-model="query.grade"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年级"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="入学年月:">
          <el-date-picker
            v-model="query.startDate"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业年月:">
          <el-date-picker
            v-model="query.graduateDate"
            type="date"
            format="yyyy-MM"
            size="small"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="query.gender" size="small" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是留学生:" placeholder="请选择">
          <el-select v-model="query.oversea" size="small">
            <el-option label="全部" value></el-option>
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="small" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/studentInfo/upload?token='AuthenticationToken'"
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
      <el-table-column fixed prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="classes" align="center" label="班级名称"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="研究生学号"></el-table-column> -->
      <el-table-column prop="name" align="center" label="研究生姓名"></el-table-column>
      <!-- <el-table-column prop="student" align="center" label="学员人数"></el-table-column> -->
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="birth" align="center" label="出生年月"></el-table-column>
      <el-table-column prop="masterType" align="center" label="研究生类别"></el-table-column>
      <el-table-column prop="studyType" align="center" label="学制"></el-table-column>
      <el-table-column prop="acceptedType" align="center" label="录取类型"></el-table-column>
      <el-table-column prop="startDate" align="center" label="入学年月"></el-table-column>
      <el-table-column prop="graduateDate" align="center" label="毕业年月"></el-table-column>
      <el-table-column prop="major" align="center" label="专业名称"></el-table-column>
      <el-table-column prop="college" align="center" label="二级学院"></el-table-column>
      <el-table-column prop="education" align="center" label="前置学历"></el-table-column>
      <el-table-column prop="school" align="center" label="毕业院校"></el-table-column>
      <el-table-column prop="oversea" align="center" label="是否留学生"></el-table-column>
      <!-- <el-table-column prop="eliminate" align="center" label="专业"></el-table-column> -->
      <el-table-column prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column prop="nativePlace" align="center" label="籍贯"></el-table-column>
      <el-table-column prop="nation" align="center" label="民族"></el-table-column>
      <el-table-column prop="industry" align="center" label="工作单位所属行业"></el-table-column>
      <el-table-column prop="postName" align="center" label="岗位及职称"></el-table-column>
      <el-table-column prop="qq" align="center" label="QQ"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="research" align="center" label="科研成果"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
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
    <el-drawer size="40%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="100px"
        class="demo-examineForm"
      >
        <el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="examineForm.auditFlag" size="small" placeholder="请选择状态">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="examineDialog = false" size="small">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="年级" prop="grade">
          <el-col :span="6">
            <el-date-picker
              v-model="form.grade"
              type="date"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="班级名称" prop="classes">
          <el-col :span="6">
            <el-input size="small" v-model="form.classes"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="研究生姓名" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" size="small" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月:" prop="birth">
          <el-date-picker
            v-model="form.birth"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="研究生类别" prop="masterType">
          <el-select v-model="form.masterType" size="small">
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学制" prop="studyType">
          <el-col :span="6">
            <el-input size="small" v-model="form.studyType"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="录取类型" prop="acceptedType">
          <el-col :span="6">
            <el-input size="small" v-model="form.acceptedType"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="入学年月:" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业年月:" prop="graduateDate">
          <el-date-picker
            v-model="form.graduateDate"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业名称" prop="major">
          <el-col :span="6">
            <el-input size="small" v-model="form.major"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="二级学院" prop="college">
          <el-col :span="6">
            <el-input size="small" v-model="form.college"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="前置学历" prop="education">
          <el-col :span="6">
            <el-input size="small" v-model="form.education"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业院校" prop="school">
          <el-col :span="6">
            <el-input size="small" v-model="form.school"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否留学生" prop="masterType">
          <el-select v-model="form.masterType" size="small" placeholder="请选择">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导师" prop="tutor">
          <el-col :span="6">
            <el-select v-model="form.tutor" placeholder="请选择老师" prop="name" size="small">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-col :span="6">
            <el-input size="small" v-model="form.nativePlace"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-col :span="6">
            <el-input size="small" v-model="form.nation"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="工作单位所属行业" prop="industry">
          <el-col :span="6">
            <el-input size="small" v-model="form.industry"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-col :span="6">
            <el-input size="small" v-model="form.qq"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-col :span="6">
            <el-input size="small" v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-col :span="6">
            <el-input size="small" v-model="form.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="科研成果" prop="research">
          <el-col :span="6">
            <el-input size="small" v-model="form.research"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('form')">重置</el-button>
      </div>
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
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      header: {},
      rules: {},
      form: {
        classes: "",
        name: "",
        gender: "",
        birth: "",
        masterType: "",
        studyType: "",
        acceptedType: "",
        startDate: "",
        graduateDate: "",
        college: "",
        education: "",
        school: "",
        oversea: "",
        tutor: "",
        nativePlace: "",
        nation: "",
        industry: "",
        postName: "",
        qq: "",
        email: "",
        research: ""
      },
      tableData: [],
      teacherList: []
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
      let res = await axios.$post("/studentInfo/list", this.query);
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
      this.list();
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
        await axios.$post("/studentInfo/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    async submitForm(formName) {
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
          await axios.$post("/studentInfo/add", this.form);
          break;
        case "edit":
          await axios.$post("/studentInfo/update", this.form);
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
          classes: "",
          name: "",
          gender: "",
          birth: "",
          masterType: "",
          studyType: "",
          acceptedType: "",
          startDate: "",
          graduateDate: "",
          college: "",
          education: "",
          school: "",
          oversea: "",
          tutor: "",
          nativePlace: "",
          nation: "",
          industry: "",
          postName: "",
          qq: "",
          email: "",
          research: ""
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
          this.exportData();
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
          location.href = "http://112.74.56.60/excel/excel-model/sjk-lxsxx.xls";
          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/studentInfo/export", {
        params: this.query
      });
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
            let internationalStudentId = element.id;
            await axios.$post("/studentInfo/delete", {
              internationalStudentId: internationalStudentId
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

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let internationalStudentId = row.id;
          await axios.$post("/studentInfo/delete", {
            internationalStudentId: internationalStudentId
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
    }
  },
  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    this.roleId = localStorage.getItem("roleId");
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
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}
</style>