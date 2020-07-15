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
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="id" align="center" label="ID"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="规则名称"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="type" align="center" label="教学类别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="english" align="center" label="是否是全英文授课">
        <template slot-scope="scope">{{ scope.row.english | formatEnglishText }}</template>
      </el-table-column>
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="rules" align="center" label="规则内容"></el-table-column> -->
      <el-table-column sortable :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
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
    <el-drawer size="60%" style="min-height:500px" title="学时规则" :visible.sync="dialogFormVisible">
      <el-form :disabled="!['edit', 'add'].includes(operate)" :model="form" label-width="180px">
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
        <el-form-item label="规则名称">
          <el-col :span="9">
            <el-input size="normal" v-model="form.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教学类别">
          <el-col :span="9">
            <el-select v-model="form.type" size="normal" placeholder="请选择授课类别">
              <el-option label="本科教学" value="本科教学"></el-option>
              <el-option label="研管安排" value="研管安排"></el-option>
              <el-option label="MBA安排" value="MBA安排"></el-option>
              <el-option label="专业硕士安排" value="专业硕士安排"></el-option>
              <el-option label="EMBA、EDP其他" value="EMBA、EDP其他"></el-option>
              <el-option label="文化素质课" value="文化素质课"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.english">研究生全英文授课</el-checkbox>
        </el-form-item>
        <el-form-item v-for="(rule, index) in rulesList" :label="'规则' + index" :key="rule.key">
          <el-col :span="3">
            <el-input size="normal" v-model="rule.min" placeholder="最小人数"></el-input>
          </el-col>
          <el-col :span="0.5">-</el-col>
          <el-col :span="3">
            <el-input size="normal" v-model="rule.max" placeholder="最大人数"></el-input>
          </el-col>
          <el-col :span="1">:</el-col>
          <el-col :span="3">
            <el-input size="normal" v-model="rule.ratio" placeholder="系数"></el-input>
          </el-col>&#12288;
          &#12288;
          <el-button
            v-if="['edit', 'add'].includes(operate)"
            size="normal"
            @click.prevent="removeRule(rule)"
          >删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="['edit', 'add'].includes(operate)"
            size="normal"
            @click="addRule"
            type="primary"
          >新增规则</el-button>
        </el-form-item>
        <!-- <el-form-item label="规则内容">
          <el-col :span="9">
            <el-input size="normal" v-model="form.rules" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="备注">
          <el-col :span="9">
            <el-input size="normal" v-model="form.remark" autocomplete="off"></el-input>
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
      rulesList: [
        {
          min: "",
          max: "",
          ratio: ""
        }
      ],
      form: {},
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
      let res = await axios.$post("/teachtimeRule/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      console.log("this.rulesList", this.rulesList);
      this.form.rules = "";
      if (this.rulesList.length > 0) {
        for (let i = 0; i < this.rulesList.length; i++) {
          this.form.rules += `${this.rulesList[i].min}-${this.rulesList[i].max}:${this.rulesList[i].ratio}|`;
        }
      }

      switch (this.operate) {
        case "add":
          await axios.$post("/teachtimeRule/add", this.form);
          break;
        case "edit":
          await axios.$post("/teachtimeRule/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      console.log("row", row);
      this.dialogFormVisible = true;
      if (this.operate === "add") {
        this.rulesList = [];
        this.form = {
          id: ""
        };
      } else {
        this.rulesList = [];
        let tempRules = [];
        let unitRules;
        if (row.rules) {
          tempRules = row.rules.split("|");
          for (let i = 0; i < tempRules.length; i++) {
            unitRules = tempRules[i].split(":");
            if (unitRules[0] && unitRules[1]) {
              let nums = unitRules[0].split("-");
              this.rulesList.push({
                min: nums[0],
                max: nums[1],
                ratio: unitRules[1]
              });
            }
          }
        }
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
          let teachtimeRuleId = row.id;
          await axios.$post("/teachtimeRule/delete", {
            teachtimeRuleId: teachtimeRuleId
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
    removeRule(item) {
      var index = this.rulesList.indexOf(item);
      if (index !== -1) {
        this.rulesList.splice(index, 1);
      }
    },
    addRule() {
      this.rulesList.push({
        min: "",
        max: "",
        ratio: "",
        key: Date.now()
      });
    }
  },
  filters: {
    formatEnglishText(val) {
      return val ? "是" : "否";
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