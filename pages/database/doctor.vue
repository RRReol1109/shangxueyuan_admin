<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            placeholder="来访时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入学号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="导师:">
          <el-input v-model="query.tutor" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="毕业专业:">
          <el-input v-model="query.graduationMajor" placeholder="请输入毕业专业" size="small"></el-input>
        </el-form-item>
        <el-form-item label="毕业学校:">
          <el-input v-model="query.graduatedSchool" placeholder="请输入毕业学校" size="small"></el-input>
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
      <el-table-column fixed prop="id" align="center" label="学号"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="major" align="center" label="录取专业"></el-table-column>
      <el-table-column prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column prop="scholarshipName" align="center" label="奖学金名称"></el-table-column>
      <el-table-column prop="financialAidName" align="center" label="助学金名称"></el-table-column>
      <el-table-column prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="graduatedSchool" align="center" label="毕业学校"></el-table-column>
      <el-table-column prop="graduationMajor" align="center" label="毕业专业"></el-table-column>
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
      title="博士生招生情况"
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
        <el-form-item label="年级:" prop="grade">
          <el-col :span="6">
            <el-input size="small" v-model="form.grade" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="学号">
          <el-col :span="6">
            <el-input size="small" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" size="small" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录取专业" prop="major">
          <el-col :span="6">
            <el-input size="small" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师" prop="tutor">
          <el-col :span="6">
            <el-input size="small" v-model="form.tutor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="奖学金名称" prop="scholarshipName">
          <el-col :span="6">
            <el-input size="small" v-model="form.scholarshipName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="助学金名称" prop="financialAidName">
          <el-col :span="6">
            <el-input size="small" v-model="form.financialAidName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业学校" prop="graduatedSchool">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduatedSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业" prop="graduationMajor">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduationMajor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
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
        major: "",
        tutor: "",
        majorCode: "",
        scholarshipName: "",
        financialAidName: "",
        grade: "",
        graduatedSchool: "",
        graduationMajor: "",
        admissionType: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        major: [{ required: true, message: "请输入专业", trigger: "blur" }],
        tutor: [{ required: true, message: "请输入导师", trigger: "blur" }],
        majorCode: [
          { required: true, message: "请输入专业代码", trigger: "blur" }
        ],
        scholarshipName: [
          { required: true, message: "请输入奖学金名称", trigger: "blur" }
        ],
        financialAidName: [
          { required: true, message: "请输入助学金名称", trigger: "blur" }
        ],
        grade: [{ required: true, message: "请输入年份", trigger: "blur" }],
        graduatedSchool: [
          { required: true, message: "请输入毕业学校", trigger: "blur" }
        ],
        graduationMajor: [
          { required: true, message: "请输入毕业专业", trigger: "blur" }
        ]
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
      let res = await axios.$post("/doctor/list", this.query);
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
          await axios.$post("/doctor/add", this.form);
          break;
        case "edit":
          await axios.$post("/doctor/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          id: "",
          name: "",
          gender: "",
          major: "",
          tutor: "",
          majorCode: "",
          scholarshipName: "",
          financialAidName: "",
          grade: "",
          graduatedSchool: "",
          graduationMajor: "",
          admissionType: "",
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
          let doctorId = row.id;
          await axios.$post("/doctor/delete", {
            doctorId: doctorId
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