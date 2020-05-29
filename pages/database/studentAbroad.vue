<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-date-picker
            v-model="query.grade"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择日期时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="拟留学身份:">
          <el-select v-model="query.studyPlan" size="small" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="硕博连读" value="硕博连读"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习期限:" size="small">
          <el-date-picker
            v-model="query.studyTime"
            type="date"
            format="yyyy-MM"
            placeholder="选择日期时间"
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
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="small" type="primary">
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
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/abroad/upload?token='AuthenticationToken'"
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
      <!-- <el-table-column fixed prop="studentId" align="center" label="学号"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column prop="phone" align="center" label="手机"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="identity" align="center" label="身份"></el-table-column>
      <el-table-column prop="studyPlan" align="center" label="留学身份"></el-table-column>
      <el-table-column prop="profession" align="center" label="专业"></el-table-column>
      <el-table-column prop="undergraduateSchool" align="center" label="本科学校"></el-table-column>
      <el-table-column prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="studySchool" align="center" label="学习学校"></el-table-column>
      <el-table-column prop="startTime" align="center" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" align="center" label="结束时间"></el-table-column>
      <el-table-column prop="learningWay" align="center" label="学习形式"></el-table-column>
      <el-table-column prop="applicationStatus" align="center" label="申请状态"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>-->
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="name" align="center" label="学生姓名"></el-table-column>
      <el-table-column prop="studentId" align="center" label="学号"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column prop="degree" align="center" label="在读学位类型"></el-table-column>
      <el-table-column prop="profession" align="center" label="专业"></el-table-column>
      <el-table-column prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="internalTutor" align="center" label="国内导师"></el-table-column>
      <el-table-column prop="studyPlan" align="center" label="拟留学身份"></el-table-column>
      <el-table-column prop="studySchool" align="center" label="留学单位（英文）"></el-table-column>
      <el-table-column prop="overseasTutor" align="center" label="海外导师"></el-table-column>
      <el-table-column prop="studyTime" align="center" label="学习期限"></el-table-column>
      <el-table-column prop="fundingType" align="center" label="资助类型"></el-table-column>
      <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
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
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-drawer size="40%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="100px"
        class="demo-examineForm"
      >
        <el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="examineForm.auditFlag" size="small" placeholder="请选择状态">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="examineDialog = false" size="small">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer size="40%" style="min-height:500px" title="出国学生" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="在读学位类型" prop="degree">
          <el-select v-model="form.degree" size="small" placeholder="请选择">
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="硕博连读" value="硕博连读"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-col :span="6">
            <el-input size="small" v-model="form.studentId" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" size="small" placeholder="请选择">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-col :span="6">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="form.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-col :span="6">
            <el-input size="small" v-model="form.phone" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-col :span="6">
            <el-input size="small" v-model="form.email" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="拟留学身份" prop="studyPlan">
          <el-select v-model="form.studyPlan" size="small" placeholder="请选择">
            <el-option label="博士联合培养" value="博士联合培养"></el-option>
            <el-option label="攻读博士学位" value="攻读博士学位"></el-option>
            <el-option label="硕士联合培养" value="硕士联合培养"></el-option>
            <el-option label="攻读硕士学位" value="攻读硕士学位"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="外语成绩">
          <el-col :span="6">
            <el-input size="small" v-model="form.languageAchievement" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="专业" prop="profession">
          <el-col :span="6">
            <el-input size="small" v-model="form.profession" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="本科学校">
          <el-col :span="6">
            <el-input size="small" v-model="form.undergraduateSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="年级" prop="grade">
          <el-col :span="6">
            <el-date-picker v-model="form.grade" type="date" format="yyyy" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="留学单位（英文）" prop="studySchool">
          <el-col :span="6">
            <el-input size="small" v-model="form.studySchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="国内导师" prop="internalTutor">
          <el-col :span="6">
            <el-input size="small" v-model="form.internalTutor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="海外导师" prop="overseasTutor">
          <el-col :span="6">
            <el-input size="small" v-model="form.overseasTutor" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学习期限" prop="studyTime">
          <el-col :span="5">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              v-model="form.studyTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <!-- <el-col class="line" :span="0.5">-</el-col>
          <el-col :span="5">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择时间"
              v-model="form.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>-->
        </el-form-item>
        <!-- <el-form-item label="学习形式">
          <el-col :span="6">
            <el-input size="small" v-model="form.learningWay" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="small" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="资助类型" prop="fundingType">
          <el-select v-model="form.fundingType" size="small" placeholder="请选择">
            <el-option label="基金委申报" value="基金委申报"></el-option>
            <el-option label="合作项目" value="合作项目"></el-option>
            <el-option label="学校资助" value="学校资助"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="form.auditFlag" size="small" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('form')">重置</el-button>
      </div>
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
      total: 0,
      page: 1,
      operate: "",
      dialogFormVisible: false,
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      query: {
        limit: 14,
        offset: 0,
        order: "remark",
        condition: ""
      },
      fileList: [],
      header: {},
      form: {
        studentId: "",
        name: "",
        degree: "",
        gender: "",
        studyPlan: "",
        birthday: "",
        phone: "",
        email: "",
        profession: "",
        grade: "2019",
        studySchool: "",
        studyTime: "",
        overseasTutor: "",
        internalTutor: "",
        fundingType: ""
      },
      rules: {
        studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
        name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        studyPlan: [
          { required: true, message: "请输入留学身份", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        profession: [
          { required: true, message: "请输入专业", trigger: "blur" }
        ],
        overseasTutor: [
          { required: true, message: "请输入海外导师", trigger: "blur" }
        ],
        internalTutor: [
          { required: true, message: "请输入海外导师", trigger: "blur" }
        ],
        studyTime: [
          { required: true, message: "请输入学习期限", trigger: "blur" }
        ],
        fundingType: [
          { required: true, message: "请输入资助类型", trigger: "blur" }
        ],
        birthday: [{ required: true, message: "请输入生日", trigger: "blur" }],
        studySchool: [
          { required: true, message: "请输入留学学校", trigger: "blur" }
        ],
        degree: [
          { required: true, message: "请输入在读学位类型", trigger: "blur" }
        ],
        grade: [{ required: true, message: "请输入年级", trigger: "blur" }]
      },
      tableData: []
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "审核已通过",
        "2": "审核未通过"
      }[value.toString()];
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async list() {
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "endTime" || key == "birthday") {
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
      let user = localStorage.getItem("userInfo");
      if (user.roleid == 7) {
        this.query.editor = user.id;
      }
      let res = await axios.$post("/abroad/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
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
          await axios.$post("/abroad/add", this.form);
          break;
        case "edit":
          await axios.$post("/abroad/update", this.form);
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
          studentId: "",
          name: "",
          degree: "",
          gender: "",
          studyTime: "",
          studyPlan: "",
          birthday: "",
          phone: "",
          email: "",
          profession: "",
          grade: "2019",
          studySchool: "",
          overseasTutor: "",
          internalTutor: "",
          fundingType: ""
        };
      } else {
        this.form = row;
      }
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
        await axios.$post("/abroad/update", this.examineForm);
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
          location.href = "http://112.74.56.60/excel/excel-model/sjk-cgxs.xls";
          break;
        case "download":
          this.exportData();
          break;
      }
    },
    uploadSuccess() {
      this.list();
    },

    async exportData() {
      let data = await axios.$download("/abroad/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-cgxs.xls");
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
            let abroadId = element.id;
            await axios.$post("/abroad/delete", {
              abroadId: abroadId
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
          let abroadId = row.id;
          await axios.$post("/abroad/delete", {
            abroadId: abroadId
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
    this.roleId = localStorage.getItem("roleId");
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>