<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="届别:">
          <el-date-picker
            v-model="query.session"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            placeholder="年度"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入专业" size="small"></el-input>
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
      <el-table-column fixed prop="session" align="center" label="届别"></el-table-column>
      <el-table-column prop="major" align="center" label="专业"></el-table-column>
      <el-table-column prop="totalCnt" align="center" label="毕业生人数"></el-table-column>
      <el-table-column prop="graduateCnt" align="center" label="毕业人数"></el-table-column>
      <el-table-column prop="finishedCnt" align="center" label="结业人数"></el-table-column>
      <el-table-column prop="degreeCnt" align="center" label="有学位"></el-table-column>
      <el-table-column prop="graduateRate" align="center" label="毕业率"></el-table-column>
      <el-table-column prop="degreeRate" align="center" label="授予学位率"></el-table-column>
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
        <el-form-item label="届别" prop="session">
          <el-col :span="6">
            <el-date-picker
              v-model="form.session"
              align="right"
              size="small"
              type="date"
              format="yyyy"
              placeholder="年度"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业生人数" prop="totalCnt">
          <el-col :span="6">
            <el-input size="small" v-model="form.totalCnt" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-col :span="6">
            <el-input size="small" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业人数" prop="graduateCnt">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduateCnt" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="结业人数" prop="finishedCnt">
          <el-col :span="6">
            <el-input size="small" v-model="form.finishedCnt" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="有学位" prop="degreeCnt">
          <el-col :span="6">
            <el-input size="small" v-model="form.degreeCnt" autocomplete="off"></el-input>
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
        // session: "2019",
        id: "",
        major: "",
        totalCnt: "",
        graduateCnt: "",
        finishedCnt: "",
        degreeCnt: ""
      },
      rules: {
        session: [{ required: true, message: "请输入界别", trigger: "blur" }],
        major: [{ required: true, message: "请输入专业", trigger: "blur" }],
        totalCnt: [
          { required: true, message: "请输入毕业生人数", trigger: "blur" }
        ],
        graduateCnt: [
          { required: true, message: "请输入毕业人数", trigger: "blur" }
        ],
        finishedCnt: [
          { required: true, message: "请输入结业人数", trigger: "blur" }
        ],
        degreeCnt: [
          { required: true, message: "请输入有学位", trigger: "blur" }
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
      let res = await axios.$post("/graduateRate/list", this.query);
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
      this.form.graduateRate =
        ((this.form.graduateCnt / this.form.totalCnt) * 100).toFixed(2) + "%";
      this.form.degreeRate =
        ((this.form.degreeCnt / this.form.totalCnt) * 100).toFixed(2) + "%";
      switch (this.operate) {
        case "add":
          await axios.$post("/graduateRate/add", this.form);
          break;
        case "edit":
          await axios.$post("/graduateRate/update", this.form);
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
          major: "",
          totalCnt: "",
          graduateCnt: "",
          finishedCnt: "",
          degreeCnt: ""
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
          let graduateRateId = row.id;
          await axios.$post("/graduateRate/delete", {
            graduateRateId: graduateRateId
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