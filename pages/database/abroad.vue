<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="英文名:">
          <el-input v-model="query.englishName" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入专业" size="small"></el-input>
        </el-form-item>
        <el-form-item label="国籍:">
          <el-input v-model="query.country" placeholder="请输入国籍" size="small"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="query.gender" size="small" placeholder="请选择性别">
            <el-option label="全部"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入专时间:">
          <el-date-picker v-model="query.entryTime" type="date" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计毕业时间:">
          <el-date-picker v-model="query.graduationTime" type="date" placeholder="选择日期时间"></el-date-picker>
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
      <el-table-column prop="englishName" align="center" label="英文名"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column prop="major" align="center" label="专业"></el-table-column>
      <el-table-column prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="qq" align="center" label="QQ"></el-table-column>
      <el-table-column prop="wechat" align="center" label="微信"></el-table-column>
      <el-table-column prop="country" align="center" label="国籍"></el-table-column>
      <el-table-column prop="passport" align="center" label="护照"></el-table-column>
      <el-table-column prop="registrationNumber" align="center" label="登记编号"></el-table-column>
      <el-table-column prop="entryTime" align="center" label="入专时间"></el-table-column>
      <el-table-column prop="graduationTime" align="center" label="预计毕业时间"></el-table-column>
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
      title="留学生信息"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="学号">
          <el-col :span="6">
            <el-input size="small" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="英文名">
          <el-col :span="6">
            <el-input size="small" v-model="form.englishName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="专业">
          <el-col :span="6">
            <el-input size="small" v-model="form.major"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" size="small">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-col :span="6">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>.
        <el-form-item label="导师">
          <el-col :span="6">
            <el-input size="small" v-model="form.tutor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号">
          <el-col :span="6">
            <el-input size="small" v-model="form.phone" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-col :span="6">
            <el-input size="small" v-model="form.email" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="QQ">
          <el-col :span="6">
            <el-input size="small" v-model="form.qq" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="微信">
          <el-col :span="6">
            <el-input size="small" v-model="form.wechat" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="国籍">
          <el-col :span="6">
            <el-input size="small" v-model="form.country" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="护照">
          <el-col :span="6">
            <el-input size="small" v-model="form.passport" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="登记编号">
          <el-col :span="6">
            <el-input size="small" v-model="form.registrationNumber" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="入专时间:">
          <el-date-picker v-model="form.entryTime" type="date" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计毕业时间:">
          <el-date-picker v-model="form.graduationTime" type="date" placeholder="选择日期时间"></el-date-picker>
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
import moment from "moment";
export default {
  layout: "normal",
  components: {},
  data() {
    var validateNumber = (rule, value, callback) => {
      if (!value || value <= 0) {
        value = parseInt(value);
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    };
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
      form: {
        id: "",
        name: "",
        englishName: "",
        gender: "1",
        phone: "",
        major: "",
        tutor: "",
        entryTime: "",
        graduationTime: "",
        type: "1",
        passport: "",
        registrationNumber: "",
        qq: "",
        wechat: "",
        birthday: "",
        email: "",
        country: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        englishName: [
          { required: true, message: "请输入英文名", trigger: "blur" }
        ],
        hours: [
          { required: true, message: "请输入学时", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        classes: [
          { required: true, message: "请输入指导班级", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        company: [
          { required: true, message: "请输入实习单位", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
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
      let res = await axios.$post("/internationalStudent/list", this.query);
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
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.ruleForm.count = parseInt(this.ruleForm.count);
          // this.ruleForm.hours = parseInt(this.ruleForm.hours);
          console.log(this.ruleForm);
          this.updataCache();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          // await axios.$post("/internationalStudent/add", this.form);
          break;
        case "edit":
          await axios.$post("/internationalStudent/update", this.form);
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
          englishName: "",
          gender: "1",
          phone: "",
          major: "",
          tutor: "",
          entryTime: "",
          graduationTime: "",
          type: "1",
          passport: "",
          registrationNumber: "",
          qq: "",
          wechat: "",
          birthday: "",
          email: "",
          country: ""
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
          let internationalStudentId = row.id;
          await axios.$post("/internationalStudent/delete", {
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