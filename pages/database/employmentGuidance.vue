<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="上传用户名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年份:">
          <el-select v-model="query.year" size="normal">
            <el-option label="全部" value></el-option>
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2016" value="2016"></el-option>
          </el-select>
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
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" align="center" label="id"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="上传用户"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="table" align="center" label="简况表名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
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
      title="学硕毕业情况"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form :model="form" label-width="320px">
        <el-form-item label="年份" label-width="320px">
          <el-col :span="6">
            <el-select v-model="form.year" size="normal">
              <el-option label="2019" value="2019"></el-option>
              <el-option label="2018" value="2018"></el-option>
              <el-option label="2017" value="2017"></el-option>
              <el-option label="2016" value="2016"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" label-width="320px">
          <el-upload class="upload-demo" action :on-change="handleChange" :file-list="fileList">
            <el-button size="normal" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="normal">确定</el-button>
        <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
      </div>
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
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      form: {
        id: "",
        name: "",
        table: "1",
        year: "",
        major: "",
        category: "",
        teacher: "",
        score: "",
        paper: "",
        pleaDate: "",
        remark: ""
      },
      tableData: [
       
      ]
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
      let res = await axios.$post("/masterGraduate/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
          await axios.$post("/masterGraduate/add", this.form);
          break;
        case "edit":
          await axios.$post("/masterGraduate/update", this.form);
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
          table: "1",
          year: "",
          major: "",
          category: "",
          teacher: "",
          score: "",
          paper: "",
          pleaDate: "",
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
          let masterGraduateId = row.id;
          await axios.$post("/masterGraduate/delete", {
            masterGraduateId: masterGraduateId
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