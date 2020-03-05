<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年度"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学院:">
          <el-input v-model="query.college" placeholder="请输入学院" size="small"></el-input>
        </el-form-item>
        <el-form-item label="一级学科:">
          <el-input v-model="query.firstLevelCategory" placeholder="请输入学科" size="small"></el-input>
        </el-form-item>
        <el-form-item label="项目名称:">
          <el-input v-model="query.projectName" placeholder="请输入项目名称" size="small"></el-input>
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
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="year" align="center" label="年度"></el-table-column>
      <el-table-column prop="college" align="center" label="学院"></el-table-column>
      <el-table-column prop="firstLevelCategory" align="center" label="一级学科"></el-table-column>
      <el-table-column prop="trainingLevel" align="center" label="培养层次"></el-table-column>
      <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
      <el-table-column prop="funding" align="center" label="经费（万元）"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
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

    <el-dialog
      style="min-height:500px"
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
        <el-form-item label="姓名" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="学号" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" size="small" placeholder="性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度:" prop="year">
          <el-date-picker
            v-model="form.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年度"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-col :span="6">
            <el-input size="small" v-model="form.college" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="一级学科" prop="firstLevelCategory">
          <el-col :span="6">
            <el-input size="small" v-model="form.firstLevelCategory" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="培养层次" prop="trainingLevel">
          <el-col :span="6">
            <el-input size="small" v-model="form.trainingLevel" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-col :span="6">
            <el-input size="small" v-model="form.projectName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经费（万元）" prop="funding">
          <el-col :span="6">
            <el-input size="small" v-model="form.funding" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="毕业学校">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduationSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业">
          <el-col :span="6">
            <el-input size="small" v-model="form.funding" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item size="small" label="备注" prop="remark">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('form')">重置</el-button>
      </div>
    </el-dialog>
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
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
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
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
        college: [{ required: true, message: "请输入学院", trigger: "blur" }],
        trainingLevel: [
          { required: true, message: "请输入培养层次", trigger: "blur" }
        ],
        firstLevelCategory: [
          { required: true, message: "请输入一级学科", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        funding: [{ required: true, message: "请输入经费", trigger: "blur" }]
      },
      tableData: []
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
          let teachingReformId = row.id;
          await axios.$post("/teachingReform/delete", {
            teachingReformId: teachingReformId
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
  mounted() {
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>