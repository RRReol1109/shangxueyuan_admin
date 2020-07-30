<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="姓名:">
          <el-input clearable id="nameBox" v-model="query.name" size="normal" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门:">
          <el-select v-model="query.deptName" size="normal">
            <el-option
              v-for="item in names"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="query.statusName" size="normal">
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
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="temp">模板下载</el-dropdown-item> -->
              <!-- <el-dropdown-item command="download">导出数据</el-dropdown-item> -->
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="freeze">冻结用户</el-dropdown-item>
              <el-dropdown-item command="unfreeze">解除冻结</el-dropdown-item>
              <el-dropdown-item command="distribution">分配角色</el-dropdown-item>
              <el-dropdown-item command="reset">重置密码</el-dropdown-item>
              <!-- <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
:file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column sortable prop="pick" label align="center" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <!-- <el-table-column sortable prop="id" align="center" label="工号"></el-table-column> -->
      <el-table-column sortable prop="account" align="center" label="用户名"></el-table-column>
      <el-table-column sortable prop="name" align="center" label="教师名"></el-table-column>
      <el-table-column sortable prop="phone" align="center" label="手机号"></el-table-column>
      <el-table-column sortable prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column sortable prop="deptName" align="center" label="部门"></el-table-column>
      <el-table-column sortable prop="roleName" align="center" label="角色"></el-table-column>
      <el-table-column sortable prop="statusName" align="center" label="状态"></el-table-column>
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
    <el-dialog width="35%" style="min-height:500px" title="批量审核操作" :visible.sync="examineDialog">
      <el-row>
        <el-col :span="8">
          <el-button @click="examineDialog = false" size="normal" style="width:97%;">取 消</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="examineData('success')"
            size="normal"
            style="width:97%;"
          >通过</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="danger"
            @click="examineData('failed')"
            size="normal"
            style="width:97%;"
          >不通过</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-drawer
      style="min-height:500px"
      title
      size="60%"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('form')">重置</el-button>
        </div>
      </div>
      <el-form :disabled="formDisabled" :model="form" label-width="100px">
        <!-- <el-form-item label="工号">
          <el-col :span="8">
            <el-input v-model="form.id"  style="width:99%"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="form.account" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师姓名">
              <el-input v-model="form.name" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="['add'].includes(operate)" label="密码">
              <el-input v-model="form.password" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="['add'].includes(operate)" label="再次输入密码">
              <el-input v-model="form.rePassword" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleid" placeholder="请选择权限" style="width:99%">
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select v-model="form.deptid" placeholder="请选择部门" style="width:99%">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.simplename"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
import moment from "moment";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      pick: false,
      loading: true,
      total: 0,
      page: 1,
      operate: "",
      header: {},
      formDisabled: false,
      dialogFormVisible: false,
      fileList: [],
      query: {
        limit: 12,
        offset: 0,
        order: "desc",
        deptid: 0,
        name: "",
        beginTime: "",
        endTime: ""
      },
      examineDialog: false,
      form: {
        account: "",
        statusName: "1",
        id: "",
        deptid: ""
      },
      examineForm: {
        roleIds: "7"
      },
      admin: false,
      names: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "27",
          label: "战略部"
        },
        {
          value: "32",
          label: "会计学系"
        },
        {
          value: "25",
          label: "开发部"
        }
      ],
      roles: [],
      statuses: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "2",
          label: "禁用"
        }
      ],
      departments: [],
      tableData: []
    };
  },
  filters: {
    statusFilter: function(value) {
      if (value) {
        return {
          "0": "管理员",
          "1": "超级管理员",
          "19": "部门管理员",
          "7": "教师",
          "21": "科研学科办公室管理员"
        }[value.toString()];
      }
    },
    flagFilter: function(value) {
      return {
        "0": "禁用",
        "1": "启用"
      }[value.toString()];
    },

    teacherFilter: async function(value) {
      let teacherList = await axios.$get("/mgr/quicklist", { params: "" });
      let temp = {};
      for (let i = 0; i < teacherList.length; i++) {
        const element = teacherList[i];
        temp[element.id + ""] = element.name;
      }
      return temp[value.toString()];
    }
  },

  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    changeFlag(row) {
      console.log("changePick");
      row.pick = !row.pick;
    },
    async list() {
      this.loading = true;
      this.pick = false;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let res = await axios.$post("/mgr/list", this.query);
      this.tableData = res;
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        if (element.roleid == "1") {
          this.admin = false;
        } else {
          this.admin = true;
        }
      }
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
          await axios.$post("/mgr/add", this.form);
          break;
        case "edit":
          console.log(this.form);
          await axios.$post("/mgr/edit", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    async handleCommand(command) {
      console.log(command);
      let userList = [];
      switch (command) {
        case "download":
          this.exportData(command);
          break;
        case "delCount":
          this.delCount();
          break;
        case "temp":
          location.href = "http://112.74.56.60/excel/excel-model/gzl-ktjx.xls";
          break;
        case "freeze":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element.pick, "freeze");
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将冻结所有选中账号, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/freeze", { userId: element.id });
            }
            this.tableData = [];
            await this.list();
          });
          break;
        case "unfreeze":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element.pick, "unfreeze");
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将解冻所有冻结账号, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/unfreeze", { userId: element.id });
            }
            this.tableData = [];
            await this.list();
          });
          break;
        case "distribution":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;
        case "reset":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将重置选中账号秘密, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/reset", { userId: element.id });
            }
            this.$message({
              type: "success",
              message: "重置成功，新密码为111111"
            });
            this.tableData = [];
            await this.list();
            //      async setTimeout(() => {
            //           this.tableData = [];
            // await this.list();
            //       }, 1000);
          });

          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/mgr/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "excel.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async delCount() {
      let deleteList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          deleteList.push(element);
        }
      }

      if (deleteList.length == 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          for (let i = 0; i < deleteList.length; i++) {
            const element = deleteList[i];
            let userId = element.id;
            await axios.$post("/mgr/delete", {
              userId: userId
            });
          }
          this.tableData = [];
          await this.list();
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
    async examineData() {
      let userList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        if (element.pick) {
          userList.push(element);
        }
      }
      if (userList.length <= 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      for (let i = 0; i < userList.length; i++) {
        const element = userList[i];
        await axios.$get("/mgr/setRole", {
          userId: element.id,
          roleIds: this.examineForm.roleIds
        });
      }
      this.$message({
        type: "success",
        message: "角色配置成功!"
      });
      this.tableData = [];
      this.list();
      this.examineDialog = false;
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
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          account: "",
          id: "",
          deptid: "",
          birthday: "1992-12-10",
          avatar: "",
          password: "",
          rePassword: ""
        };
      } else {
        // this.form = row;
        this.form = {
          account: row.account,
          id: row.id,
          deptid: row.deptid.toString(),
          birthday: row.birthday,
          avatar: row.avatar,
          email: row.email,
          phone: row.phone,
          name: row.name,
          roleid: row.roleid.toString(),
          password: "",
          rePassword: ""
        };
        console.log("AAAA", this.form);
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
          let userId = row.id;
          await axios.$post("/mgr/delete", {
            userId: userId
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
    async init() {
      // 初始化权限下拉
      this.roles = await axios.$post("/role/list");
      // 初始化部门
      this.departments = await axios.$get("/dept/list", {
        params: {
          limit: 1000,
          offset: 0,
          order: "desc",
          condition: ""
        }
      });
      this.roles.filter(function(value) {
        value.id = value.id.toString();
        return value;
      });
      this.departments.filter(function(value) {
        value.id = value.id.toString();
        return value;
      });
      console.log("this.departments::", this.departments);
    }
  },
  mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.init();
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
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>