<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-date-picker
            v-model="query.grade"
            align="right"
            size="normal"
            type="date"
            placeholder="年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.num" placeholder="请输入学号" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-select v-model="query.major" size="normal">
            <el-option label="金融硕士" value="金融硕士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导师:">
          <el-select v-model="query.tutor" filterable placeholder="请选择老师" prop="name">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业专业:">
          <el-input v-model="query.graduationMajor" placeholder="请输入毕业专业" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="毕业学校:">
          <el-input v-model="query.graduatedSchool" placeholder="请输入毕业学校" size="normal"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search">查询</el-button>
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
              <!-- <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>-->
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1||roleId==19">批量审核</el-dropdown-item>
              <!-- <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
:file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/simulation/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed prop="num" align="center" label="学号"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="录取专业"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="scholarshipName" align="center" label="学校类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="工作年限"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="工作单位/行业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="职位"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="年薪"></el-table-column>-->
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="出生年月"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="邮箱"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="年级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="scholarshipName"
        align="center"
        label="奖学金名称"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="financialAidName"
        align="center"
        label="助学金名称"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="graduatedSchool"
        align="center"
        label="毕业学校"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="graduationMajor"
        align="center"
        label="毕业专业"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remarks" align="center" label="备注"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
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
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="150px"
        class="demo-examineForm"
      >
        <el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="examineForm.auditFlag" size="normal" placeholder="请选择状态">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="examineDialog = false" size="normal">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="normal">确定</el-button>
            <el-button size="normal" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
      style="min-height:500px"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="150px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="姓名" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学号" prop="num">
          <el-col :span="6">
            <el-input size="normal" v-model="form.num" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" size="normal" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录取专业" prop="major">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="学校类别" prop="name">
          <el-select v-model="form.gender" size="normal">
            <el-option label="211工程高校" value="1"></el-option>
            <el-option label="双一流建设高校" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作年限" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="工作单位/行业" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="职位" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年薪" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="出生年月" prop="name">
          <el-col :span="6">
            <el-date-picker v-model="form.date" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="邮箱" prop="name">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      
        -->
        <!-- <el-form-item label="手机号" prop="tell">
          <el-col :span="6">
            <el-input size="normal" v-model="form.tell" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="年级" prop="grade">
          <el-col :span="6">
            <el-input size="normal" v-model="form.grade" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师" prop="tutor">
          <el-col :span="6">
            <el-select v-model="form.tutor" filterable placeholder="请选择老师" prop="name">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="奖学金名称" prop="scholarshipName">
          <el-col :span="6">
            <el-input size="normal" v-model="form.scholarshipName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="助学金名称" prop="financialAidName">
          <el-col :span="6">
            <el-input size="normal" v-model="form.financialAidName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业学校" prop="graduatedSchool">
          <el-col :span="6">
            <el-input size="normal" v-model="form.graduatedSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业" prop="graduationMajor">
          <el-col :span="6">
            <el-input size="normal" v-model="form.graduationMajor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="normal" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remarks" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="normal">确定</el-button>
        <el-button size="normal" @click="resetForm('form')">重置</el-button>
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
      operate: "",
      dialogFormVisible: false,
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      teacherList: [],
      flag: true,
      total: 0,
      page: 1,
      form: {
        num: "",
        name: "",
        gender: "",
        education: "",
        major: "",
        tell: "",
        mail: "",
        tutor: "",
        majorCode: "",
        scholarshipName: "",
        financialAidName: "",
        grade: "",
        graduatedSchool: "",
        graduationMajor: "",
        admissionType: "",
        remarks: ""
      },
      rules: {
        num: [{ required: true, message: "请输入学号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        education: [
          { required: true, message: "请输入来访时间", trigger: "blur" }
        ],
        major: [{ required: true, message: "请输入专业", trigger: "blur" }],
        financialAidName: [
          { required: true, message: "请输入助学金名称", trigger: "blur" }
        ],
        graduatedSchool: [
          { required: true, message: "请输入毕业学校", trigger: "blur" }
        ],
        tutor: [{ required: true, message: "请输入导师", trigger: "blur" }],
        scholarshipName: [
          { required: true, message: "请输入奖学金名称", trigger: "blur" }
        ],
        grade: [{ required: true, message: "请输入年级", trigger: "blur" }],
        graduationMajor: [
          { required: true, message: "请输入毕业专业", trigger: "blur" }
        ]
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
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
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
      let res = await axios.$post("/masterEnroll/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    downLoad(row) {
      window.open(row.file);
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
          await axios.$post("/masterEnroll/add", this.form);
          this.fileList = [];
          break;
        case "edit":
          await axios.$post("/masterEnroll/update", this.form);
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
        this.flag = false;
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
          let masterEnrollId = row.id;
          await axios.$post("/masterEnroll/delete", {
            masterEnrollId: masterEnrollId
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

    async examineData() {
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
        console.log(element.auditFlag);
        this.examineForm.id = element.id;
        await axios.$post("/masterEnroll/update", this.examineForm);
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
            let masterEnrollId = element.id;
            await axios.$post("/masterEnroll/delete", {
              masterEnrollId: masterEnrollId
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

  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.roleId = localStorage.getItem("roleId");
    this.teacherList = this.teacherList.rows;
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>