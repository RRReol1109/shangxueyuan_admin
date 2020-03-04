<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-date-picker
            v-model="query.interviewTime"
            align="right"
            size="small"
            type="date"
            placeholder="来访时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入专业" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="query.gender" size="small">
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
      <el-table-column fixed prop="id" align="center" label="学号"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="major" align="center" label="专业"></el-table-column>
      <el-table-column prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="classes" align="center" label="班级"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
      <el-table-column prop="employer" align="center" label="工作单位"></el-table-column>
      <el-table-column prop="address" align="center" label="家庭住址"></el-table-column>
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
      title="通讯录"
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
        <el-form-item label="手机号" prop="phone">
          <el-col :span="6">
            <el-input size="small" v-model="form.phone" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-col :span="6">
            <el-input size="small" v-model="form.grade" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="班级" prop="classes">
          <el-col :span="6">
            <el-input size="small" v-model="form.classes" placeholder="请输入班级"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师" prop="tutor">
          <el-col :span="6">
            <el-input size="small" v-model="form.tutor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-col :span="6">
            <el-input size="small" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="工作单位" prop="employer">
          <el-col :span="6">
            <el-input size="small" v-model="form.employer" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="家庭地址" prop="address">
          <el-col :span="6">
            <el-input size="small" v-model="form.address" autocomplete="off"></el-input>
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
        phone: "",
        grade: "2019",
        major: "",
        tutor: "",
        classes: "",
        employer: "",
        address: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        grade: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        major: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        tutor: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        classes: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        employer: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        address: [{ required: true, message: "请输入姓名", trigger: "blur" }]
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
      let res = await axios.$post("/addressBook/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
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
          await axios.$post("/addressBook/add", this.form);
          break;
        case "edit":
          await axios.$post("/addressBook/update", this.form);
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
          let addressBookId = row.id;
          await axios.$post("/addressBook/delete", {
            addressBookId: addressBookId
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