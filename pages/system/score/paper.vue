<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-select v-model="query.year" size="normal">
            <el-option label="2019年" value="2019"></el-option>
            <el-option label="2018年" value="2018"></el-option>
            <el-option label="2017年" value="2017"></el-option>
            <el-option label="2016年" value="2016"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="desc" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="show(scope.row)" type="text" size="normal">查看</el-button>
          <el-button @click="edit(scope.row)" type="text" size="normal">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="normal">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </nav>

    <!-- 学时查看窗口 -->
    <el-drawer
      size="60%"
      style="min-height:500px"
      title="分数规则（论文）"
      :visible.sync="dialogFormVisible"
    >
      <el-form :disabled="formDisabled" :model="form" label-width="180px">
        <el-form-item label="年度">
          <el-date-picker
            v-model="form.year"
            align="right"
            size="normal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="年度"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.type" size="normal">
            <el-option label="中文论文" value="1"></el-option>
            <el-option label="英文论文" value="2"></el-option>
            <el-option label="博硕论文" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(rule, index) in form.rules"
          :label="'规则' + (index + 1)"
          :key="rule.key"
        >
          <el-col :span="3">
            <el-input size="normal" v-model="rule.level" placeholder="等级"></el-input>
          </el-col>
          <el-col :span="0.5">：</el-col>
          <el-col :span="3">
            <el-input size="normal" v-model="rule.score" placeholder="分数"></el-input>
          </el-col>
          <el-col :span="1">&#12288;</el-col>
          <el-button
            v-if="form.rules.length > 1 && !formDisabled"
            size="normal"
            type="primary"
            @click.prevent="removeRule(rule)"
          >删除</el-button>
        </el-form-item>
        <el-form-item label>
          <el-col :span="12" v-if="!formDisabled">
            <el-button size="normal" type="primary" @click="addRule">新增</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="!formDisabled" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" size="normal">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      formDisabled: false,
      query: {
        year: "2019"
      },
      form: {
        year: "2019",
        type: "1",
        rules: [
          {
            key: Date.now(),
            level: "A+",
            score: 0
          }
        ]
      },
      tableData: [
        {
          id: "0001",
          year: "2019",
          type: "中文论文",
          desc: "备注"
        },
        {
          id: "0002",
          year: "2019",
          type: "英文论文",
          desc: "备注"
        },
        {
          id: "0003",
          year: "2019",
          type: "博硕士论文",
          desc: "备注"
        }
      ]
    };
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.form = {
        year: "2019",
        type: "1",
        rules: [
          {
            key: Date.now(),
            level: "A+",
            score: 0
          }
        ]
      };
    },
    show(row) {
      this.dialogFormVisible = true;
      this.formDisabled = true;
      this.form = {
        year: "2019",
        type: "1",
        rules: [
          {
            key: Date.now(),
            level: "A+",
            score: 0
          }
        ]
      };
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.form = {
        year: "2019",
        type: "1",
        rules: [
          {
            key: Date.now(),
            level: "A+",
            score: 0
          }
        ]
      };
    },
    del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
      var index = this.form.rules.indexOf(item);
      if (index !== -1 && this.form.rules.length > 1) {
        this.form.rules.splice(index, 1);
      }
    },
    addRule() {
      if (this.form.rules.length < 10) {
        this.form.rules.push({
          year: "2019",
          type: "1",
          rules: [
            {
              key: Date.now(),
              level: "A+",
              score: 0
            }
          ]
        });
      } else {
        this.$message({
          message: "警告，论文级别超过限制个数！",
          type: "warning"
        });
      }
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
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>