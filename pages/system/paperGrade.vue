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
        <!-- <el-form-item label="类别:">
          <el-select v-model="query.type" size="normal">
            <el-option label="全部" value></el-option>
            <el-option label="中文论文" value="中文论文"></el-option>
            <el-option label="英文" value="英文论文"></el-option>
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
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="id" label="ID" align="center" width="50"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="type" align="center" label="论文类别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="level" align="center" label="级别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="score" align="center" label="分数"></el-table-column>
      <!-- <el-table-column sortable v-show="false" prop="cates" align="center" label="类目"></el-table-column> -->
      <el-table-column sortable :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button            @click="operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"

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

    <!-- 学时查看窗口 -->
    <el-drawer
      size="60%"
      style="min-height:500px"
      title="分数规则（论文）"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :disabled="!['edit', 'add'].includes(operate)"
        ref="form"
        :model="form"
        label-width="180px"
      >
        <el-form-item label="年度:" prop="year">
          <el-date-picker
            size="normal"
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="form.type" size="normal" placeholder="选择类别">
            <el-option label="中文论文" value="中文论文"></el-option>
            <el-option label="英文论文" value="英文论文"></el-option>
            <!-- <el-option label="博硕论文" value="博硕论文"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" size="normal" placeholder="选择级别">
            <el-option label="A+" value="A+"></el-option>
            <el-option label="A" value="A"></el-option>
            <el-option label="A-" value="A-"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-col :span="9">
            <el-input clearable size="normal" v-model="form.score" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-for="(cates, index) in catesList" :label="'类目' + index" :key="cates.key">
          <el-col :span="5">
            <el-input size="normal" v-model="cates.ssn" placeholder="SSN号"></el-input>
          </el-col>
          <el-col :span="1">:</el-col>
          <el-col :span="8">
            <el-input size="normal" v-model="cates.name" placeholder="期刊名"></el-input>
          </el-col>&#12288;
          &#12288;
          <el-button
            v-if="['edit', 'add'].includes(operate)"
            size="normal"
            @click.prevent="removeCates(cates)"
          >删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="['edit', 'add'].includes(operate)"
            size="normal"
            @click="addCates"
            type="primary"
          >新增类目</el-button>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="9">
            <el-input size="normal" v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="normal">确 定</el-button>
        <el-button size="normal" @click="resetForm()">重 置</el-button>
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
        limit: 10,
        offset: 0,
        order: "remark",
        condition: ""
      },
      form: {
        year: "",
        type: "",
        level: "",
        cates: "",
        remark: ""
      },
      catesList: [
        {
          ssn: "",
          name: ""
        }
      ],
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
      let res = await axios.$post("/paperLevel/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async submitForm(formName) {
      console.log("this.catesList", this.catesList);
      this.form.cates = "";
      if (this.catesList.length > 0) {
        for (let i = 0; i < this.catesList.length; i++) {
          this.form.cates += `${this.catesList[i].ssn}:${this.catesList[i].name}|`;
        }
      }
      switch (this.operate) {
        case "add":
          await axios.$post("/paperLevel/add", this.form);
          break;
        case "edit":
          await axios.$post("/paperLevel/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
  showDialog(row) {
      if (this.operate === "edit" && row.auditFlag == 1) {
        this.$confirm("本条数据已审核无法修改", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      console.log("row:::", row);
      if (this.operate === "add") {
        this.catesList = [];
        this.form = {
          id: "",
          year: "",
          type: "",
          level: "",
          cates: "",
          remark: ""
        };
      } else {
        this.catesList = [];
        let tempCates = [];
        let unitCates;
        if (row.cates) {
          tempCates = row.cates.split("|");
          for (let i = 0; i < tempCates.length; i++) {
            unitCates = tempCates[i].split(":");
            if (unitCates[0] && unitCates[1]) {
              this.catesList.push({
                ssn: unitCates[0],
                name: unitCates[1]
              });
            }
          }
        }
        this.form = row;
      }
      this.dialogFormVisible = true;
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let paperLevelId = row.id;
          await axios.$post("/paperLevel/delete", {
            paperLevelId: paperLevelId
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
    },
    resetForm() {
      this.form = {
        id: "",
        year: "",
        type: "",
        level: "",
        cates: "",
        remark: ""
      };
    },
    removeCates(item) {
      var index = this.catesList.indexOf(item);
      if (index !== -1) {
        this.catesList.splice(index, 1);
      }
    },
    addCates() {
      this.catesList.push({
        ssn: "",
        name: "",
        key: Date.now()
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
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>