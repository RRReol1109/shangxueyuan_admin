<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="授予硕士学位专业:">
          <el-select v-model="query.major" size="normal">
            <el-input v-model="query.teacher" placeholder="请输入专业"></el-input>
          </el-select>
        </el-form-item>
        <el-form-item label="导师:">
          <el-input v-model="query.teacher" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.category" placeholder="请输入专业"></el-input>
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
      <el-table-column sortable fixed prop="id" align="center" label="学号"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="birthday" align="center" label="出生日期"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="major" align="center" label="授予硕士学位专业"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="category" align="center" label="专业"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacher" align="center" label="导师"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="score"
        align="center"
        label="课程学习情况（总学分/学位课学分/平均绩点）"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="paper" align="center" label="在读期间发表论文"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="pleaDate" align="center" label="答辩日期"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacher" align="center" label="毕业时间"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacher" align="center" label="毕业去向"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacher" align="center" label="电话"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacher" align="center" label="邮箱"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button            @click="operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"
            v-if="scope.row.auditFlag!=1"
          >编辑</el-button>
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

    <el-drawer
      style="min-height:500px"
      title="学硕毕业情况"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form :model="form" label-width="320px">
        <el-form-item label="姓名" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学号" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="出生日期" label-width="320px">
          <el-col :span="6">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" label-width="320px">
          <el-select v-model="form.gender" size="normal">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授予硕士学位专业" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.teacher" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="专业" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.category" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程学习情况（总学分/学位课学分/平均绩点）" label-width>
          <el-col :span="6">
            <el-input size="normal" v-model="form.score" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="在读期间发表论文" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.paper" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="答辩日期" label-width="320px">
          <el-col :span="6">
            <el-date-picker v-model="form.pleaDate" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业时间" label-width="320px">
          <el-col :span="6">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业去向" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.paper" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电话" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.paper" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.paper" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" label-width="320px">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
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
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      form: {
        id: "",
        name: "",
        gender: "1",
        birthday: "",
        major: "",
        category: "",
        teacher: "",
        score: "",
        paper: "",
        pleaDate: "",
        remark: ""
      },
      tableData: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async list() {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          if (key == "pleaDate" || key == "birthday") {
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
          }
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
          gender: "1",
          birthday: "",
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
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>