<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="form">
        <el-form-item label="角色名:">
          <el-input
            size="normal"
            v-model="query.roleName"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-search"
            @click="list()"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="initAddForm()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column
        sortable
        type="index"
        label="序号"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="id"
        type="hidden"
        align="center"
        label="角色ID"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="name"
        align="center"
        label="角色名称"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="tips"
        align="center"
        label="别名"
      ></el-table-column>
      <el-table-column
        sortable
        fixed="right"
        align="center"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" size="normal"
            >编辑权限</el-button
          >
          <el-button type="text" @click="del(scope.row)" size="normal"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色面板 -->
    <el-drawer size="60%" :visible.sync="dialogAddVisible" title="权限详情">
      <el-form :model="form" label-width="180px">
        <el-form-item label="角色名称">
          <el-col :span="6">
            <el-input
              v-model="form.name"
              autocomplete="off"
              size="medium"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="别名">
          <el-col :span="6">
            <el-input
              v-model="form.tips"
              autocomplete="off"
              size="medium"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="title" class="header-title">
        <el-button @click="dialogAddVisible = false" size="normal"
          >取 消</el-button
        >
        <el-button type="primary" @click="add()" size="normal">添 加</el-button>
      </div>
    </el-drawer>

    <!-- 权限面板 -->
    <el-drawer
      class="roleDialog"
      style="min-height: 500px"
      title="权限详情"
      :visible.sync="dialogDetailVisible"
    >
      <div>
        <span>角色：</span>
        <span v-text="roleName"></span>
      </div>
      <span style="color: #409eff">详情：</span>
      <!-- <el-button size="normal" type="primary" @click="showRoleEndTime=!showRoleEndTime">设置到期时间</el-button> -->
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        ref="tree"
        :disabled="true"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :render-content="renderContent"
        :props="defaultProps"
      ></el-tree>
      <div v-if="!dialogEditDisabled">
        <el-button @click="dialogDetailVisible = false" size="normal"
          >取 消</el-button
        >
        <el-button type="primary" @click="saveRoles()" size="normal"
          >保 存</el-button
        >
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
      dialogAddVisible: false,
      dialogDetailVisible: false,
      dialogEditDisabled: false,
      showRoleEndTime: false,
      roleId: "",
      roleName: "",
      defaultCheckedKeys: [],
      query: {
        order: "desc",
        offset: 0,
        limit: 10,
        roleName: "",
      },
      form: {
        id: "",
        name: "",
        pid: 0,
        deptid: 0,
        tips: "",
        num: "",
      },
      tableData: [],
      data2: [
        {
          id: 777,
          label: "功能列表",
          date: "",
        },
        {
          id: 888,
          label: "待办统计",
          date: "",
        },
        {
          id: 999,
          label: "数据审核",
          date: "",
        },
        {
          id: 1,
          label: "系统管理",
          date: "",
          children: [
            {
              id: 2,
              label: "角色",
              date: "",
            },
            // {
            //   id: 3,
            //   label: "管理员",
            //   date: ""
            // },
            {
              id: 4,
              label: "部门",
              date: "",
            },
            {
              id: 5,
              label: "用户管理",
              date: "",
            },
            // {
            //   id: 6,
            //   label: "论文等级",
            //   date: ""
            // },
            // {
            //   id: 7,
            //   label: "学时规则",
            //   date: ""
            // },
            // {
            //   id: 8,
            //   label: "分数规则",
            //   date: "",
            //   children: [
            //     {
            //       id: 9,
            //       label: "科研立项",
            //       date: ""
            //     },
            //     {
            //       id: 10,
            //       label: "科研成果",
            //       date: ""
            //     },
            //     {
            //       id: 6,
            //       label: "论文等级",
            //       date: ""
            //     },
            //     {
            //       id: 11,
            //       label: "著作&教材",
            //       date: ""
            //     }
            //   ]
            // },
            {
              id: 12,
              label: "日志",
              date: "",
            },
          ],
        },
        {
          id: 13,
          label: "工作量管理",
          date: "",
          children: [
            {
              id: 14,
              label: "论文指导",
              date: "",
            },
            {
              id: 15,
              label: "研究生指导",
              date: "",
            },
            {
              id: 16,
              label: "课堂教学",
              date: "",
            },
            {
              id: 17,
              label: "实习",
              date: "",
            },
            {
              id: 18,
              label: "沙盘模拟",
              date: "",
            },
            {
              id: 19,
              label: "社会调查",
              date: "",
            },
            {
              id: 20,
              label: "统计",
              date: "",
            },
            {
              id: 105,
              label: "数据报表",
              date: "",
            },
          ],
        },
        {
          id: 21,
          label: "科研奖励管理",
          date: "",
          children: [
            {
              id: 22,
              label: "著作&教材",
              date: "",
            },
            {
              id: 23,
              label: "中文论文",
              date: "",
            },
            {
              id: 24,
              label: "英文论文",
              date: "",
            },
            {
              id: 25,
              label: "获奖",
              date: "",
            },
            {
              id: 60,
              label: "要报",
              date: "",
            },
            {
              id: 26,
              label: "优秀硕博论文",
              date: "",
            },
            {
              id: 27,
              label: "科研项目",
              date: "",
            },
            {
              id: 61,
              label: "横向课题",
              date: "",
            },
            {
              id: 62,
              label: "教师参会情况",
              date: "",
            },
            // {
            //   id: 63,
            //   label: "优秀硕博论文",
            //   date: ""
            // },
            {
              id: 28,
              label: "统计",
              date: "",
            },
            {
              id: 105,
              label: "数据报表",
              date: "",
            },
          ],
        },
        {
          id: 29,
          label: "数据库",
          date: "",
          children: [
            {
              id: 46,
              label: "本科生模块",
              date: "",
              children: [
                {
                  id: 48,
                  label: "招生",
                  date: "",
                },
                {
                  id: 49,
                  label: "毕业",
                  date: "",
                },
              ],
            },
            {
              id: 50,
              label: "研究生模块",
              date: "",
              children: [
                {
                  id: 51,
                  label: "教学",
                  date: "",
                },
                {
                  id: 52,
                  label: "招生",
                  date: "",
                },
                {
                  id: 53,
                  label: "毕业",
                  date: "",
                },
              ],
            },
            {
              id: 54,
              label: "博士生模块",
              date: "",
              children: [
                {
                  id: 55,
                  label: "教学",
                  date: "",
                },
                {
                  id: 56,
                  label: "招生",
                  date: "",
                },
                {
                  id: 57,
                  label: "毕业",
                  date: "",
                },
              ],
            },
            {
              id: 80,
              label: "教职工信息",
              date: "",
            },
            {
              id: 30,
              label: "出国学生",
              date: "",
            },
            {
              id: 31,
              label: "学术交流",
              date: "",
            },
            {
              id: 32,
              label: "学科点简况",
              date: "",
            },
            {
              id: 33,
              label: "专硕名单",
              date: "",
            },
            {
              id: 34,
              label: "通讯录",
              date: "",
            },
            {
              id: 35,
              label: "学科建设",
              date: "",
            },
            {
              id: 36,
              label: "博士生招生情况",
              date: "",
            },
            {
              id: 37,
              label: "留学生信息",
              date: "",
            },
            {
              id: 39,
              label: "学硕招生情况",
              date: "",
            },
            {
              id: 38,
              label: "学硕毕业情况",
              date: "",
            },
            {
              id: 58,
              label: "专硕招生情况",
              date: "",
            },
            {
              id: 59,
              label: "专硕毕业情况",
              date: "",
            },
            {
              id: 40,
              label: "教师教改项目",
              date: "",
            },
            {
              id: 41,
              label: "优秀毕业生简况",
              date: "",
            },
            {
              id: 42,
              label: "毕业率",
              date: "",
            },
            {
              id: 43,
              label: "就业指导",
              date: "",
            },
            {
              id: 44,
              label: "三学科人员",
              date: "",
            },
            {
              id: 45,
              label: "活动规划",
              date: "",
            },
            ,
            {
              id: 81,
              label: "学生竞赛奖励",
              date: "",
            },
            {
              id: 82,
              label: "学生创新创业",
              date: "",
            },
            {
              id: 83,
              label: "学生发表学术论文",
              date: "",
            },
            {
              id: 84,
              label: "学生获得专利",
              date: "",
            },
            {
              id: 85,
              label: "学生个人荣誉称号",
              date: "",
            },
            {
              id: 86,
              label: "学生学科信息",
              date: "",
            },
            {
              id: 87,
              label: "学生党员情况",
              date: "",
            },
            {
              id: 88,
              label: "毕业生",
              date: "",
            },
            {
              id: 89,
              label: "国内外交流学生",
              date: "",
            },
          ],
        },
        {
          id: 77,
          label: "MBA模块",
          date: "",
          children: [
            {
              id: 64,
              label: "招生信息",
              date: "",
            },
            {
              id: 65,
              label: "学生具体信息",
              date: "",
            },
            {
              id: 66,
              label: "教师职工信息",
              date: "",
            },
            {
              id: 67,
              label: "教师期刊论文管理",
              date: "",
            },
            {
              id: 68,
              label: "教师学术议会管理",
              date: "",
            },
            {
              id: 69,
              label: "教师纵向科研信息",
              date: "",
            },
            {
              id: 70,
              label: "教师横向科研信息",
              date: "",
            },
            {
              id: 71,
              label: "进校科研经费",
              date: "",
            },
            {
              id: 72,
              label: "教师主编出版学术著作教材信息",
              date: "",
            },
            {
              id: 73,
              label: "教师负责人成果获奖信息",
              date: "",
            },
            {
              id: 74,
              label: "兼职教师信息",
              date: "",
            },
            {
              id: 75,
              label: "研究生课堂教学",
              date: "",
            },
            {
              id: 76,
              label: "研究生论文指导",
              date: "",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        date: "date",
        disabled: this.disabledFn,
      },
    };
  },
  methods: {
    disabledFn() {
      return false;
      // return this.dialogEditDisabled;
    },
    // 保存权限
    async saveRoles() {
      this.dialogDetailVisible = false;
      let ids = this.$refs.tree.getCheckedKeys();
      console.log("保存权限：", this.roleId, "----", ids);

      await axios.$post("/role/setAuthority", {
        roleId: this.roleId,
        ids: ids.join(),
      });
      this.$message({
        type: "success",
        message: "编辑成功!",
      });
    },
    async initAddForm() {
      this.dialogAddVisible = true;
      this.form = {
        id: "",
        name: "",
        pid: 0,
        deptid: 0,
        tips: "",
        num: "",
      };
    },
    async add() {
      console.log("添加数据");
      this.dialogAddVisible = false;
      await axios.$post("/role/add", this.form);
      this.list();
    },
    async edit(row) {
      var that = this;
      if (that.$refs.tree) {
        that.$refs.tree.setCheckedKeys([]);
        that.bindSelectedTree(row);
      } else {
        this.$nextTick(function () {
          that.bindSelectedTree(row);
        });
      }
    },
    async bindSelectedTree(row) {
      this.roleId = row.id;
      this.roleName = row.roleName;
      this.dialogDetailVisible = true;
      this.dialogEditDisabled = false;
      let result = await axios.$get("/menu/checkedMenuListByRoleId", {
        roleId: this.roleId,
      });
      console.log("show roles:", result);
      this.defaultCheckedKeys = result.data;
    },
    del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除角色
          if (row.id != 1 && row.id != 7 && row.id != 19) {
            axios
              .$get("/role/remove", { roleId: row.id })
              .then((response) => {
                if (response.code == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.list();
                } else {
                  this.$message({
                    type: "success",
                    message: "删除失败!",
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "删除失败!",
                });
              });
          } else {
            this.$message({
              type: "info",
              message: "该角色无法删除",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    renderContent(h, { node, data, store }) {
      return (
        <div>
          <span style="line-height: 30px; float:left; flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 20px;">
            <span>
              <span>{data.label}</span>
            </span>
          </span>
          <el-date-picker
            v-show={this.showRoleEndTime}
            v-model={data.date}
            size="normal"
            type="date"
            placeholder="截止日期(默认无限)"
          ></el-date-picker>
        </div>
      );
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedKeys());
    },

    getHalfCheckedKeys() {
      console.log(this.$refs.tree.getHalfCheckedKeys());
    },
    async list() {
      this.loading = true;
      let result = await axios.$post("/role/list", this.query);
      this.tableData = result;
      this.loading = false;
    },
  },
  mounted() {
    this.list();
  },
};
</script>

<style>
.search-form {
  margin-bottom: 0px;
}
.roleDialog .el-input--normal .el-input__inner {
  line-height: 26px;
  height: 26px;
  width: 200px;
}
.roleDialog .el-tree-node__content {
  line-height: 30px;
  height: 30px;
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