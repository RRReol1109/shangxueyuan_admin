<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
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
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="score" align="center" label="基础分数/万字" ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="national" align="center" label="国家规划" ></el-table-column>
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

    <el-drawer size="60%" style="min-height:500px" title="分数规则（著作&教材）" :visible.sync="dialogFormVisible">
      <el-form :disabled="!['edit', 'add'].includes(operate)" :model="form" label-width="150px">
        <el-form-item label="年度:">
          <el-date-picker
            size="normal"
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类别">
          <el-select  v-model="form.type" size="normal" placeholder="选择类别">
            <el-option label="教材" value="教材"></el-option>
            <el-option label="著作" value="著作"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础分数">
          <el-col :span="9">
            <el-input size="normal" v-model="form.score" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="0.5">
            /万字
          </el-col>
        </el-form-item>
        <div v-if="form.type === '教材'">
          <span style="color: #409EFF;">额外加分条件:</span>
          <el-form-item label="国家规划">
            <el-col :span="9">
              <el-input size="normal" v-model="form.national" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="normal">确定</el-button>
        <!-- <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button> -->
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
      loading: true,
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
        type: "1",
        year: "2019",
        score: 0,
        nationalPlan: 0 // 国家规划
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
      this.loading = true;
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
      let res = await axios.$post("/bookRule/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
          await axios.$post("/bookRule/add", this.form);
          break;
        case "edit":
          await axios.$post("/bookRule/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
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
          let bookRuleId = row.id;
          await axios.$post("/bookRule/delete", {
            bookRuleId: bookRuleId
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

<style>
.search-form {
  margin-bottom: 10px;
}
.el-input.is-disabled .el-input__inner {
  color: #606266;
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