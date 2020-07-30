<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="上传用户名:">
          <el-input size="normal" v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="负责人:">
          <el-input size="normal" v-model="query.charge" placeholder="请输入姓名"></el-input>
        </el-form-item>-->
        <el-form-item label="学科名:">
          <el-input size="normal" v-model="query.subject" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="normal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="年份"
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
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1||roleId==19">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/subjectInfo/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column sortable align="center" type="selection" width="50"></el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <!-- <el-table-column sortable fixed prop="id" align="center" label="id"></el-table-column> -->
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="editorName"
        align="center"
        label="上传用户"
      ></el-table-column>
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="charge" align="center" label="负责人"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="subject" align="center" label="学科名"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="phone" align="center" label="联系电话"></el-table-column>-->
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="文件名"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="file" align="center" label="文件路径"></el-table-column>-->
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="auditFlag"
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button
            @click="operate='edit';showDialog(scope.row)"
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
      title="学硕毕业情况"
      :visible.sync="dialogFormVisible"
      size="60%"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('form')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('form')">重置</el-button>
        </div>
      </div>
      <el-form
        style="min-height:500px"
        title="通讯录"
        :visible.sync="dialogFormVisible"
        label-width="180px"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <!-- <el-form-item label="ID" label-width="320px">
          <el-col :span="6">
            <el-input size="normal" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="年份">
          <el-date-picker
            v-model="form.year"
            align="right"
            size="normal"
            type="year"
            format="yyyy"
            value-format="yyyy"
            style="width:99%"
            placeholder="年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="normal" label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" style="width:99%"></el-input>
        </el-form-item>
        <div>
          <el-divider content-position="left">附件</el-divider>
          <el-table
            :data="additionFiles"
            border
            style="width: 100%"
            size="normal"
            header-row-class-name="h30"
            header-cell-class-name="tc-g2 bc-g"
          >
            <el-table-column
              sortable
              :show-overflow-tooltip="true"
              type="index"
              label="#"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column sortable :show-overflow-tooltip="true" prop label="文件名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name.split('/').pop() }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable :show-overflow-tooltip="true" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="downloadAdditionFile(scope.row)" type="primary" size="mini">下载</el-button>
                <el-button @click="deleteAdditionFile(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-upload
            class="dragger"
            :show-file-list="false"
            :on-success="uploadAdditionSuccess"
            drag
            :headers="header"
            action="http://bs.hk.darkal.cn/mgr/upload"
            multiple
          >
            <div class="el-upload__tip" slot="tip"></div>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-form>
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
      total: 0,
      checkedList: [],
      page: 1,
      operate: "",
      dialogFormVisible: false,
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      fileList: [],
      form: {
        file: "",
        name: "",
        year: ""
      },
      additionFiles: [],
      header: {},
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      tableData: []
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    }
  },
  methods: {
    async uploadAdditionSuccess(response) {
      console.log("this.form:::", this.form);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.form.file = JSON.stringify(this.additionFiles);
          await axios.$post("/articleCn/update", this.form);
        }
      }
    },
    downloadAdditionFile(row) {
      window.open(row.name);
    },
    async deleteAdditionFile(row) {
      this.additionFiles = this.additionFiles.filter(
        it => it.name !== row.name
      );
      if (this.operate == "edit") {
        this.form.file = JSON.stringify(this.additionFiles);
        await axios.$post("/articleCn/update", this.form);
      }
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
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
      let res = await axios.$post("/subjectInfo/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    async submitForm(formName) {
      this.form.user = localStorage.getItem("userId");
      this.form.userName = JSON.parse(localStorage.getItem("userInfo")).name;
      if (this.additionFiles)
        this.form.file = JSON.stringify(this.additionFiles);
      switch (this.operate) {
        case "add":
          await axios.$post("/subjectInfo/add", this.form);
          break;
        case "edit":
          await axios.$post("/subjectInfo/update", this.form);
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
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {};
        this.additionFiles = [];
      } else {
        if (row.file) this.additionFiles = JSON.parse(row.file);
        this.form = row;
      }
    },
    success(res, file, files) {
      console.log(files[0].response);
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.form.file = element.response;
        this.form.name = element.name;
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
          let subjectInfoId = row.id;
          await axios.$post("/subjectInfo/delete", {
            subjectInfoId: subjectInfoId
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
    async changeFlag(row) {
      row.pick = !row.pick;
    },

    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/subjectInfo/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },

    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "examine":
          let deleteList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element);
            if (element.pick) {
              deleteList.push(element);
            }
          }
          if (deleteList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;
        case "delCount":
          this.delCount();
          break;
        case "temp":
          this.exportData(command);
          break;
        case "download":
          this.exportData(command);
          break;
      }
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },

    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/subjectInfo/export?id=-1", {});
      } else {
        data = await axios.$download("/subjectInfo/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "数据库-学科建设.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async delCount() {
      let vm = this;
      if (this.checkedList.length == 0) {
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
          for (let i = 0; i < vm.checkedList.length; i++) {
            await axios.$post("/subjectInfo/delete", {
              subjectInfoId: vm.checkedList[i].id
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
    }
  },
  mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.roleId = localStorage.getItem("roleId");
    this.list();
  }
};
</script>

<style scoped>
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.search-form {
  margin-bottom: 10px;
}
</style>