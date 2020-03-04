<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="query.gender" size="small" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
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
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="age" align="center" label="年龄"></el-table-column>
      <el-table-column prop="bachelor" align="center" label="学士获得时间,学校，学科"></el-table-column>
      <el-table-column prop="master" align="center" label="硕士获得时间,学校，学科"></el-table-column>
      <el-table-column prop="doctor" align="center" label="博士获得时间,学校，学科"></el-table-column>
      <el-table-column prop="desc" align="center" label="简介"></el-table-column>
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
      title="优秀毕业生"
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
        <el-form-item label="年龄" prop="age">
          <el-col :span="6">
            <el-input size="small" v-model="form.age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学士获得时间,学校，学科" prop="bachelor">
          <el-col :span="6">
            <el-input size="small" v-model="form.bachelor"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="硕士获得时间,学校，学科" prop="master">
          <el-col :span="6">
            <el-input size="small" v-model="form.master"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="博士获得时间,学校，学科" prop="doctor">
          <el-col :span="6">
            <el-input size="small" v-model="form.doctor"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-col :span="6">
            <el-input size="small" v-model="form.desc"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="6">
            <el-input size="small" v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-select v-model="form.gender" size="small" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
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
        name: "",
        age: "",
        bachelor: "",
        master: "",
        doctor: "",
        desc: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }]
        // master: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // doctor: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      tableData: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let res = await axios.$post("/outstandingGraduate/list", this.query);
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
          await axios.$post("/outstandingGraduate/add", this.form);
          break;
        case "edit":
          await axios.$post("/outstandingGraduate/update", this.form);
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
          age: "",
          bachelor: "",
          master: "",
          doctor: "",
          desc: "",
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
          let outstandingGraduateId = row.id;
          await axios.$post("/outstandingGraduate/delete", {
            outstandingGraduateId: outstandingGraduateId
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