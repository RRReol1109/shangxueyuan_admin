<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="日志类型:">
          <el-select v-model="query.logtype" size="small" placeholder="请选择类型">
            <el-option label="登录日志" value="1"></el-option>
            <el-option label="业务日志" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="日志名称:">
          <el-input id="nameBox" v-model="query.logname" placeholder="请输入日志名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户名称:">
          <el-input id="nameBox" v-model="query.userName" placeholder="请输入用户名称" size="small"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="时间:">
          <el-date-picker v-model="query.createtime" type="date" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>-->
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="logtype" align="center" label="日志类型"></el-table-column>
      <el-table-column prop="logname" align="center" label="日志名称"></el-table-column>
      <el-table-column prop="userName" align="center" label="用户名称"></el-table-column>
      <!-- <el-table-column prop="classname" align="center" label="类名"></el-table-column> -->
      <el-table-column prop="createtime" align="center" label="时间"></el-table-column>
      <!-- <el-table-column prop="method" align="center" label="方法名"></el-table-column> -->
      <el-table-column prop="message" align="center" label="具体消息"></el-table-column>
      <!-- <el-table-column prop="ip" align="center" label="ip"></el-table-column> -->
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination
        background
        :page-size="14"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        layout="prev, pager, next"
        :total="this.total"
      ></el-pagination>
    </nav>
  </div>
</template>

<script>
import moment from "moment";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      loading: true,
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      query: {
        logtype: "1",
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      tableData: [],
      formDisabled: false
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
          if (key == "createtime") {
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
      let res;
      if (this.query.logtype == 2) {
        res = await axios.$post("/log/list", this.query);
      } else {
        res = await axios.$post("/loginLog/list", this.query);
      }

      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    // async submitForm(formName) {
    //   switch (this.operate) {
    //     case "edit":
    //       await axios.$post("/textbook/update", this.ruleForm);
    //       break;
    //   }
    //   this.dialogFormVisible = false;
    //   await this.list();
    // },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.ruleForm = row;
    },
    async del(row) {
      this.$confirm("此操作将永久删除所有日志, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let textbookId = row.id;
          await axios.$post("/textbook/delete", {
            textbookId: textbookId
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
#nameBox {
  width: 200px;
}
</style>