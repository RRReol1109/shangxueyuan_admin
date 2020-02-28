<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            size="small"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
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
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="id" align="center" width="50"></el-table-column>
      <el-table-column prop="year" align="center" label="年度" width="100"></el-table-column>
      <el-table-column prop="level" align="center" label="项目类型" ></el-table-column>
      <el-table-column prop="baseScore" align="center" label="基础分数"></el-table-column>
      <el-table-column prop="guangzhaoScore" align="center" label="光召科技奖"></el-table-column>
      <el-table-column prop="gongxianScore" align="center" label="杰出贡献奖"></el-table-column>
      <el-table-column prop="levelOne" align="center" label="一等奖"></el-table-column>
      <el-table-column prop="levelTwo" align="center" label="二等奖"></el-table-column>
      <el-table-column prop="levelThree" align="center" label="三等奖"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
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
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        layout="prev, pager, next"
        :total="this.total"
      ></el-pagination>
    </nav>

    <el-dialog style="min-height:500px" title="分数规则（科研成果）" :visible.sync="dialogFormVisible">
      <el-form :disabled="!['edit', 'add'].includes(operate)" :model="form" label-width="100px">
        <el-form-item label="年度:">
          <el-date-picker
            size="small"
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select  v-model="form.level" size="small" placeholder="选择类型">
            <el-option label="国家级“三大奖”" value="国家级“三大奖”"></el-option>
            <el-option label="教育部人文社科奖" value="教育部人文社科奖"></el-option>
            <el-option label="省部级" value="省部级"></el-option>
            <el-option label="国家自科基金和国家社科基金结题评估" value="国家自科基金和国家社科基金结题评估"></el-option>
            <el-option label="成果入选《高校智库专刊》" value="成果入选《高校智库专刊》"></el-option>
            <el-option label="成果入选教育部社科委 《专家建议》" value="成果入选教育部社科委 《专家建议》"></el-option>
            <el-option label="成果入选中宣部社科规划办《成果要报》" value="成果入选中宣部社科规划办《成果要报》"></el-option>
            <el-option label="成果入选人民日报(理论版)" value="成果入选人民日报(理论版)"></el-option>
            <el-option label="成果入选光明日报(理论版)" value="成果入选光明日报(理论版)"></el-option>
            <el-option label="成果入选经济日报(理论版)" value="成果入选经济日报(理论版)"></el-option>
            <el-option label="成果获得领导批示" value="成果获得领导批示"></el-option>
            <el-option label="专利(含软件著作权)" value="专利(含软件著作权)"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.level === '国家级“三大奖”' || form.level === '教育部人文社科奖' || form.level === '省部级'">
          <el-form-item label="一等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelOne" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="二等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelTwo" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="三等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelThree" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="基础分数">
            <el-col :span="9">
              <el-input size="small" v-model="form.baseScore" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '省部级'">
          <el-form-item label="光召科技奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.guangzhaoScore" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="杰出贡献奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.gongxianScore" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <!-- <div v-if="form.level === '1' || form.level === '2'">
          <el-form-item label="一等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelOne" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="二等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelTwo" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="三等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelThree" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '3'">
          <el-form-item label="一等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelOne" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="二等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelTwo" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="三等奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.levelThree" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="科技贡献奖">
            <el-col :span="9">
              <el-input size="small" v-model="form.techContribution" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '4'">
          <el-form-item label="优秀项目">
            <el-col :span="9">
              <el-input size="small" v-model="form.excellent" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '5'">
          <el-form-item label="成果要报">
            <el-col :span="9">
              <el-input size="small" v-model="form.resultNews" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="高校智库专刊">
            <el-col :span="9">
              <el-input size="small" v-model="form.universityDataBase" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="专家建议">
            <el-col :span="9">
              <el-input size="small" v-model="form.expertAdvice" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="报纸">
            <el-col :span="9">
              <el-input size="small" v-model="form.newspaper" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '6'">
          <el-form-item label="国家级领导人">
            <el-col :span="9">
              <el-input size="small" v-model="form.nationalLeader" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="省部主要领导">
            <el-col :span="9">
              <el-input size="small" v-model="form.provincialLeader" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div v-if="form.level === '7'">
          <el-form-item label="专利">
            <el-col :span="9">
              <el-input size="small" v-model="form.patent" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </div> -->
        <el-form-item label="备注">
          <el-col :span="9">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.remark"></el-input>
          </el-col>
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
        order: "remark",
        condition: ""
      },
      form: {
        level: "1",
        year: "2019",
        baseScore: 0, // 基础分数
        levelOne: 0, // 一等奖
        levelTwo: 0, // 二等奖
        levelThree: 0, // 三等奖
        guangzhao: 0, // 光召科技奖
        gongxian: 0, // 杰出贡献奖
        remark: "" // 备注
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
      let res = await axios.$post("/resultRule/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formactivityTheme) {
      switch (this.operate) {
        case "add":
          await axios.$post("/resultRule/add", this.form);
          break;
        case "edit":
          await axios.$post("/resultRule/update", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
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
          let resultRuleId = row.id;
          await axios.$post("/resultRule/delete", {
            resultRuleId: resultRuleId
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
</style>