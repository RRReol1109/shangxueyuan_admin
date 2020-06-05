<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="form">
        <el-form-item label="账号:">
          <el-input id="nameBox" v-model="query.name" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="query.describe" size="normal">
            <el-option
              v-for="item in describes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button size="normal" type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button size="normal" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="id" align="center" label="管理员账号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="用户名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="describe" align="center" label="角色"></el-table-column>
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
    <el-drawer size="60%" style="min-height:500px" title="新增管理员" :visible.sync="dialogFormVisible">
      <el-form :disabled="formDisabled" :model="form" label-width="100px">
        <el-form-item label="管理员账号">
          <el-col :span="6">
            <el-input v-model="form.name" size="normal"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="用户名">
          <el-col :span="6">
            <el-input v-model="form.name" size="normal"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="form.describe" size="normal">
            <el-option label="部门管理员" value="1"></el-option>
          </el-select>
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
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      formDisabled: false,
      query: {
        name: "",
        describe: "1"
      },
      form: {
        name: "2019",
        describe: "1"
      },
      describes: [
        {
          value: "1",
          label: "部门管理员"
        }
      ],
      tableData: [
        {
          id: "0001",
          name: "喂喂喂",
          describe: "部门管理员"
        },
        {
          id: "0002",
          name: "喵喵喵",
          describe: "部门管理员"
        },
        {
          id: "0003",
          name: "咕咕咕",
          describe: "部门管理员"
        }
      ]
    };
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.form = {     
        name: "",
        describe: "1"
      };
    },
    show(row) {
      this.dialogFormVisible = true;
      this.formDisabled = true;
      this.form = {     
        name: "",
        describe: "1"
      };
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      this.form = {     
        name: "",
        describe: "1"
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
          key: Date.now(),
       
          name: ""
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
  margin-bottom: 0px;
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
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}
</style>