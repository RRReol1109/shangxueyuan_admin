<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="上传用户名:">
          <el-input size="small" v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="负责人:">
          <el-input size="small" v-model="query.charge" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学科名:">
          <el-input size="small" v-model="query.subject" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            placeholder="来访时间"
          ></el-date-picker>
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
      <el-table-column fixed prop="id" align="center" label="id"></el-table-column>
      <el-table-column prop="userName" align="center" label="上传用户"></el-table-column>
      <!-- <el-table-column prop="charge" align="center" label="负责人"></el-table-column>
      <el-table-column prop="subject" align="center" label="学科名"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>-->
      <el-table-column prop="name" align="center" label="文件名"></el-table-column>
      <el-table-column prop="file" align="center" label="文件路径"></el-table-column>
      <el-table-column prop="year" align="center" label="年份"></el-table-column>
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
      title="学硕毕业情况"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form
        style="min-height:500px"
        title="通讯录"
        :visible.sync="dialogFormVisible"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <!-- <el-form-item label="ID" label-width="320px">
          <el-col :span="6">
            <el-input size="small" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="年份" label-width="320px">
          <el-col :span="6">
            <el-date-picker
              v-model="form.year"
              align="right"
              size="small"
              type="date"
              format="yyyy"
              placeholder="来访时间"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="文件上传" label-width="320px">
          <el-upload
            class="upload-demo"
            :file-list="fileList"
            :headers="header"
            action="http://bsart.zz.kuangyeyuan.com/mgr/upload"
            :on-success="success"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item size="small" label="备注" prop="remark">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
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
      fileList: [],
      form: {
        file: "",
        name: "",
        year: ""
      },
      header: {},
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
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
      let res = await axios.$post("/subjectInfo/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      this.form.user = localStorage.getItem("userId");
      switch (this.operate) {
        case "add":
          await axios.$post("/subjectInfo/add", this.form);
          break;
        case "edit":
          await axios.$post("/subjectInfo/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {};
      } else {
        this.form = row;
      }
    },
    success(res, file, files) {
      console.log(files[0].response);
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.form.file = element.response;
        this.form.name = element.name;
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
          let subjectInfoId = row.id;
          await axios.$post("/subjectInfo/delete", {
            subjectInfoId: subjectInfoId
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
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>