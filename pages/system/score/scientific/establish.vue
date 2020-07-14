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
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level" align="center" label="项目级别" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="项目类型" min-width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="score" align="center" label="基础计分" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="national" align="center" label="重点项目加分" min-width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="province" align="center" label="重大项目加分" min-width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remake" align="center" label="备注"></el-table-column>
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
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        layout="prev, pager, next"
        :total="this.total"
        :disabled="!['edit', 'add'].includes(operate)"
      ></el-pagination>
    </nav>

    <el-drawer size="60%" style="min-height:500px" title="分数规则（科研立项）" :visible.sync="dialogFormVisible">
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
        <el-form-item label="项目级别">
          <el-select  v-model="form.level" size="normal" placeholder="选择级别" @change="selectLevel">
            <el-option label="1级" value="1级"></el-option>
            <el-option label="2级" value="2级"></el-option>
            <el-option label="3级" value="3级"></el-option>
            <el-option label="4级" value="4级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select v-if="form.level=='1级'"  v-model="form.type" size="normal" placeholder="选择项目类型">
            <el-option v-show="form.level='1级'" label="国家自然科学基金项目" value="国家自然科学基金项目"></el-option>
            <el-option label="国家社会科学基金项目" value="国家社会科学基金项目"></el-option>
            <el-option label="国家软科学研究计划项目" value="国家软科学研究计划项目"></el-option>
            <el-option label="国家973 项目" value="国家973 项目"></el-option>
            <el-option label="国家科技支撑计划项目等其他国家级项目" value="国家科技支撑计划项目等其他国家级项目"></el-option>
          </el-select>
          <el-select v-if="form.level=='2级'"  v-model="form.type" size="normal" placeholder="选择项目类型">
            <el-option label="省级精品课程" value="省级精品课程"></el-option>
            <el-option label="国家精品课程" value="国家精品课程"></el-option>
          </el-select>
          <el-select v-if="form.level=='3级'"  v-model="form.type" size="normal" placeholder="选择项目类型">
            <el-option label="教育部立项的各类纵向项目(以学 校职称评审认定为准) " value="教育部立项的各类纵向项目(以学 校职称评审认定为准) "></el-option>
          </el-select>
          <el-select v-if="form.level=='4级'"  v-model="form.type" size="normal" placeholder="选择项目类型">
            <el-option label="部委(不含教育部)" value="部委(不含教育部)"></el-option>
            <el-option label="省级立项的纵向项目(省教育厅立项的教改项目)" value="省级立项的纵向项目(省教育厅立项的教改项目)"></el-option>
            <el-option label="省科技厅立项科技项目" value="省科技厅立项科技项目"></el-option>
            <el-option label="省自科基金项目" value="省自科基金项目"></el-option>
            <el-option label="省社科基金项目" value="省社科基金项目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础分数">
          <el-col :span="9">
            <el-input size="normal" v-model="form.baseScore" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <div v-if="form.level!=='3级'">
          <span style="color: #409EFF;">额外加分条件:</span>
          <el-form-item label="重点项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.key" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重大项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <!-- <div v-if="form.level === '1'">
          <el-form-item label="重点项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.key" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="国家重点项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.nationalKey" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重大项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="国家重大项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.nationalMajor" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '2'">
          <el-form-item label="国家级课程">
            <el-col :span="9">
              <el-input size="normal" v-model="form.nationalCurriculum" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="省级课程">
            <el-col :span="9">
              <el-input size="normal" v-model="form.provincialCurriculum" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '3'">
          <el-form-item label="重点项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.key" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重大项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '4'">
          <el-form-item label="重点项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.key" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重大项目">
            <el-col :span="9">
              <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div> -->
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
import moment from "moment";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      loading: true,
      formDisabled: false,
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
      yearsOptions: [],
      form: {
        level: 1,
        year: "",
        type: "",
        baseScore: 0,
        key: 0, // 重点
        major: 0, // 重大
        nationalKey: 0, // 国家重点
        nationalMajor: 0, // 国家重大
        provincialCurriculum: 0, // 省级课程
        nationalCurriculum: 0 // 国家级课程
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
      let res = await axios.$post("/projectRule/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.pages);
      this.loading = false;
    },
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
          await axios.$post("/projectRule/add", this.form);
          break;
        case "edit":
          await axios.$post("/projectRule/update", this.form);
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
          id: ""
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
          let projectRuleId = row.id;
          await axios.$post("/projectRule/delete", {
            projectRuleId: projectRuleId
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
    selectLevel() {
      console.log("selectLevel");
      // this.form.type = "";
    }
  },
  mounted() {
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 2010; i--) {
      this.yearsOptions.push({
        value: i,
        label: i
      });
    }
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