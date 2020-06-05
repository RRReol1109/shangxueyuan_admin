<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="form">
        <el-form-item label="部门:">
          <el-input id="nameBox" v-model="query.condition" placeholder="请输入关键字" size="normal"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态:">
          <el-select v-model="query.status" size="normal">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
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
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="simplename" align="center" label="部门简称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="fullname" align="center" label="部门全称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tips" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="operate='show';operate='show';showDialog(scope.row)"
            type="text"
            size="normal"
          >查看</el-button>
          <el-button
            @click="operate='edit';operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"
          >编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="normal">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <nav style="text-align: center; margin-top: 10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="14"
        :total="this.total"
      ></el-pagination>
    </nav>-->

    <!-- 新建部门 -->
    <el-drawer
      style="min-height:500px"
      title="新增部门"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
      size="60%"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('form')">重置</el-button>
        </div>
      </div>

      <el-form :disabled="!['edit', 'add'].includes(operate)" :model="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门简称">
              <el-input v-model="form.simplename" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门全称">
              <el-input v-model="form.fullname" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.tips" style="width:99%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="form.status" size="medium">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
    </el-drawer>
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
      total: 0,
      dialogFormVisible: false,
      formDisabled: false,
      yearsOptions: [],
      operate: "",
      loading: true,
      page: 1,
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      form: {
        id: "",
        simplename: "",
        fullname: "",
        tips: "",
        num: "",
        pid: 0
      },
      tableData: []
    };
  },

  mounted() {
    this.list();
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      this.loading = true;
      this.tableData = await axios.$get("/dept/list", {
        params: this.query
      });
      this.loading = false;
    },

    async submitForm() {
      switch (this.operate) {
        case "add":
          await axios.$post("/dept/add", this.form);
          break;
        case "edit":
          await axios.$post("/dept/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          id: "",
          simplename: "",
          fullname: "",
          tips: "",
          num: "",
          pid: 0
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
          let deptId = row.id;
          await axios.$post("/dept/delete", {
            deptId: deptId
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
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>