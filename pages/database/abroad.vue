<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <!-- <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号" size="normal"></el-input>
        </el-form-item>-->
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="英文名:">
          <el-input v-model="query.englishName" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-input v-model="query.major" placeholder="请输入专业" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="国籍:">
          <el-input v-model="query.country" placeholder="请输入国籍" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="query.gender" size="normal" placeholder="请选择性别">
            <el-option label="全部" value></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入专时间:">
          <el-date-picker v-model="query.entryTime" type="date" size="normal" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="预计毕业时间:">
          <el-date-picker
            v-model="query.graduationTime"
            size="normal"
            type="date"
            placeholder="选择日期时间"
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
                  action="http://bs.hk.darkal.cn/internationalStudent/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="studentNum" align="center" label="学号"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="englishName" align="center" label="英文名"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="education" align="center" label="学历"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="major" align="center" label="专业"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="phone" align="center" label="联系电话"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="qq" align="center" label="QQ"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="wechat" align="center" label="微信"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="country" align="center" label="国籍"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="passport" align="center" label="护照"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="registrationNumber"
        align="center"
        label="登记编号"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="entryTime" align="center" label="入专时间"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="graduationTime"
        align="center"
        label="预计毕业时间"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button            @click="operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"
            v-if="scope.row.auditFlag!=1"
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
      size="60%"
      style="min-height:500px"
      title="留学生信息"
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
      <el-form
        :model="form"
        :rules="rules"
        label-width="180px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <!-- <el-form-item label="学号" prop="">
          <el-col :span="6">
            <el-input size="normal" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNum">
              <el-input size="normal" v-model="form.studentNum" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input size="normal" v-model="form.name" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="英文名" prop="englishName">
              <el-input size="normal" v-model="form.englishName" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-input size="normal" v-model="form.education" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input size="normal" v-model="form.major" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导师" prop="tutor">
              <el-select
                v-model="form.tutor"
                placeholder="请选择老师"
                filterable
                prop="name"
                style="width:99%"
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input size="normal" v-model="form.phone" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input size="normal" v-model="form.email" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ" prop="qq">
              <el-input size="normal" v-model="form.qq" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信" prop="wechat">
              <el-input size="normal" v-model="form.wechat" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="国籍" prop="country">
              <el-input size="normal" v-model="form.country" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护照" prop="passport">
              <el-input size="normal" v-model="form.passport" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记编号" prop="registrationNumber">
              <el-input
                size="normal"
                v-model="form.registrationNumber"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入专时间:" prop="entryTime">
              <el-date-picker
                v-model="form.entryTime"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计毕业时间:" prop="graduationTime">
          <el-date-picker
            v-model="form.graduationTime"
            type="date"
            placeholder="选择日期时间"
            style="width:99%"
          ></el-date-picker>
        </el-form-item>
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
    var validateNumber = (rule, value, callback) => {
      if (!value || value <= 0) {
        value = parseInt(value);
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    };
    return {
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      deptid: "",
      fileList: [],
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      fileList: [],
      header: {},
      examineForm: {},
      form: {
        id: "",
        name: "",
        englishName: "",
        gender: "1",
        phone: "",
        major: "",
        tutor: "",
        entryTime: "",
        graduationTime: "",
        type: "1",
        passport: "",
        registrationNumber: "",
        qq: "",
        wechat: "",
        birthday: "",
        email: "",
        country: ""
      },
      rules: {
        englishName: [
          { required: true, message: "请输入英文名", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "请输入性别", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        entryTime: [
          { required: true, message: "请输入入专时间", trigger: "blur" }
        ],
        major: [{ required: true, message: "请输入专业", trigger: "blur" }],
        birthday: [{ required: true, message: "请输入生日", trigger: "blur" }],
        graduationTime: [
          { required: true, message: "请输入入专时间", trigger: "blur" }
        ],
        registrationNumber: [
          { required: true, message: "请输入登记编号", trigger: "blur" }
        ],
        country: [{ required: true, message: "请输入入国籍", trigger: "blur" }],
        tutor: [{ required: true, message: "请输入导师", trigger: "blur" }]
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
    handleClick(row) {
      console.log(row);
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async list() {
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "entryTime" || key == "graduationTime") {
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
          }
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = user.id;
      }
      let res = await axios.$post("/internationalStudent/list", this.query);
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          const element = res.rows[i];
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const item = element[key];
              if (key == "entryTime" || key == "graduationTime") {
                element[key] = moment(item).format("YYYY-MM-DD");
                console.log(element[key]);
              }
            }
          }
        }
      }
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    async examineData(flag) {
      let examineList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          examineList.push(element);
        }
      }
      for (let i = 0; i < examineList.length; i++) {
        const element = examineList[i];
        console.log(element.auditFlag, "=======" + flag);
        this.examineForm.id = element.id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/internationalStudent/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    async submitForm(formName) {
      let verification = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          verification = true;
          console.log("success");
          return true;
        } else {
          verification = false;
          console.log("error submit!!");
          return false;
        }
      });
      if (verification) {
      } else {
        this.$message({
          type: "info",
          message: "请填写正确数据"
        });
        return;
      }
      switch (this.operate) {
        case "add":
          await axios.$post("/internationalStudent/add", this.form);
          break;
        case "edit":
          await axios.$post("/internationalStudent/update", this.form);
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
          id: "",
          name: "",
          englishName: "",
          gender: "",
          phone: "",
          major: "",
          tutor: "",
          entryTime: "",
          graduationTime: "",
          type: "",
          passport: "",
          registrationNumber: "",
          qq: "",
          wechat: "",
          birthday: "",
          email: "",
          country: ""
        };
      } else {
        this.form = row;
      }
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData(command);
          break;
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
      }
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/internationalStudent/export?id=-1", {});
      } else {
        data = await axios.$download("/internationalStudent/export", {
          params: this.query
        });
      }

      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "数据库-留学生信息.xls");
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
      if (deleteList.length <= 0) {
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
            let internationalStudentId = element.id;
            await axios.$post("/internationalStudent/delete", {
              internationalStudentId: internationalStudentId
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

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let internationalStudentId = row.id;
          await axios.$post("/internationalStudent/delete", {
            internationalStudentId: internationalStudentId
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
  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.teacherList = this.teacherList.rows;
    this.roleId = localStorage.getItem("roleId");
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
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