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
        <el-form-item label="教师:">
          <el-select size="small" v-model="query.teachers" placeholder="请选择老师" clearable>
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习单位:">
          <el-input clearable id="nameBox" v-model="query.company" placeholder="请输入单位" size="small"></el-input>
        </el-form-item>
        <el-form-item label="指导班级:">
          <el-input clearable id="nameBox" v-model="query.classes" placeholder="请输入班级" size="small"></el-input>
        </el-form-item>
        <el-form-item label="实习地点" prop="type">
          <el-select v-model="query.type" size="small" placeholder="请选择地点">
            <el-option label="全部" value></el-option>
            <el-option label="校内" value="校内"></el-option>
            <el-option label="市内" value="市内"></el-option>
            <el-option label="市外" value="市外"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="query.auditFlag" size="small" placeholder="请选择状态">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label-width="320px"></el-form-item>
        <el-form-item label>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown v-if="showFunctionList" @command="handleCommand" style="float:right;">
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
                  action="http://bsoa.csu.edu.cn/bs/internship/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="year" align="center" label="年度"></el-table-column>
      <el-table-column prop="address" align="center" label="地址"></el-table-column>
      <el-table-column prop="type" align="center" label="实习地点"></el-table-column>
      <el-table-column prop="hours" align="center" label="实习时长"></el-table-column>
      <el-table-column prop="days" align="center" label="实习周数"></el-table-column>
      <el-table-column prop="ratio" align="center" label="核定系数"></el-table-column>
      <el-table-column prop="userName" align="center" label="教师"></el-table-column>
      <el-table-column prop="classes" align="center" label="指导班级"></el-table-column>
      <el-table-column prop="company" align="center" label="实习单位"></el-table-column>
      <el-table-column prop="editorName" align="center" label="录入人"></el-table-column>
      <el-table-column prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" align="center" label="备注"></el-table-column>
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
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="14"
        :total="this.total"
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
          <el-form-item label="审核状态:" v-if="role">
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
    <el-drawer size="40%" style="min-height:500px" title :visible.sync="dialogFormVisible" :disabled="read">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="年度" prop="year">
          <el-col :span="12">
            <el-date-picker
              size="small"
              v-model="ruleForm.year"
              type="year"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择年份"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.address"
              :fetch-suggestions="queryAddress"
              placeholder="请输入内容"
              :disabled="read"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="实习地点" prop="type">
          <el-col :span="12">
            <el-select v-model="ruleForm.type" placeholder="请选择地点" :disabled="read">
              <el-option label="校内" value="校内"></el-option>
              <el-option label="市内" value="市内"></el-option>
              <el-option label="市外" value="市外"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="实习人数" prop="count">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.count"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
              :disabled="read"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="实习时长" prop="hours">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.hours"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
              :disabled="read"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="实习周数" prop="days">
          <el-col :span="12">
            <el-input
              v-model="ruleForm.days"
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
              :disabled="read"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="核定系数" prop="ratio">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.ratio" placeholder="核定系数" :disabled="read"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          v-for="(teacherArr, index) in ruleForm.teacherArr"
          :label="'老师' + (index+1)"
          :key="teacherArr.key"
          :prop="'teacherArr.' + index + '.value'"
        >
          <el-col :span="12">
            <el-select v-model="teacherArr.name" placeholder="请选择老师" prop="name">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="teacherArr.title" placeholder="职称">
              <el-option label="教授" value="教授"></el-option>
              <el-option label="副教授" value="副教授"></el-option>
            </el-select>
            <el-checkbox v-model="teacherArr.flag">是否是队长</el-checkbox>
            <el-button style="width:200px;" @click="removeTeacher(teacherArr)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-if="!['show'].includes(operate)">
          <el-button type="primary" @click="addTeacher('ruleForm')">继续添加老师</el-button>
        </el-form-item>
        <!-- <el-form-item label="老师信息:" :prop="'teacherInfo'" v-if="['show'].includes(operate)">
          <el-col :span="12">
            <label>教师id-教师姓名-职称（教授/副教授）-是否是队长</label>
            <el-input v-model="ruleForm.teachers" :rows="5" type="textarea" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="指导班级" prop="classes">
          <el-col :span="12">
            <el-autocomplete
              v-model="ruleForm.classes"
              :fetch-suggestions="queryClasses"
              placeholder="请输入班级"
              :disabled="read"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="实习单位" prop="company">
          <el-col :span="12">
            <el-autocomplete
              v-model="ruleForm.company"
              :fetch-suggestions="queryCompany"
              placeholder="请输入实习单位"
              :disabled="read"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="small" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import moment from "moment";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
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
      showFunctionList: false,
      examineDialog: false,
      total: 0,
      pick: false,
      fileList: [],
      read: false,
      loading: false,
      header: {},
      teacherList: [],
      dialogFormVisible: false,
      formDisabled: false,
      courseNames: [],
      yearsOptions: [],
      page: 1,
      roleId: 0,
      role: false,
      query: { limit: 14, offset: 0, order: "desc", condition: "" },
      tableData: [],
      operate: "",
      examineForm: {
        auditFlag: "0"
      },
      ruleForm: {
        id: "",
        year: "2019",
        address: "",
        type: "1",
        count: 0,
        hours: 0,
        days: 0,
        ratio: "1.0",
        teacherArr: [
          {
            name: "",
            title: "",
            flag: false
          }
        ],
        classes: "",
        company: ""
      },
      rules: {
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        count: [
          { required: true, message: "请输入实习人数", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        hours: [
          { required: true, message: "请输入学时", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        classes: [
          { required: true, message: "请输入指导班级", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        company: [
          { required: true, message: "请输入实习单位", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ]
      },
      yearsOptions: [],
      addressArr: [],
      classesArr: [],
      companyArr: [],
      userList: [],
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      }
    };
  },
  filters: {
    self: this,
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
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData();
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
          location.href = "http://bsoa.csu.edu.cn/excel-model/gzl-sx.xls";
          break;
      }
    },
    async list() {
      this.loading = true;
      this.userList = await axios.$post("/mgr/list", this.query);

      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = localStorage.getItem("userId");
        this.role = false;
      } else {
        this.role = true;
      }
      console.log(this.query.editor);
      let query = this.query;
      for (let i = 0; i < this.teacherList.length; i++) {
        const element = this.teacherList[i];
        console.log(element.name);
        if (element.name === query.teachers) {
          query.teachers = element.id;
        }
      }
      let res = await axios.$post("/internship/list", this.query);
      for (let i = 0; i < res.rows.length; i++) {
        const element = res.rows[i];
        element.pick = false;
      }
      this.tableData = res.rows;
      // for (let i = 0; i < this.tableData.length; i++) {
      //   const element = this.tableData[i].teachers.split("|");
      //   for (let j = 0; j < element.length; j++) {
      //     const item = element[j];
      //     if (j == 0 || j % 2 == 0) {
      //       console.log(item, "==========item");
      //       for (let x = 0; x < this.teacherList.length; x++) {
      //         const teacher = this.teacherList[x];
      //         console.log(teacher.id + "TACHER====");
      //         if (item.toString() === teacher.id.toString()) {
      //           let flag = element[j + 1] == "0" ? "队长" : "队员";
      //           this.tableData[i].teachers = teacher.name + "|" + flag;
      //         }
      //       }
      //     }
      //   }
      // }
      this.total = parseInt(res.total);
      this.loading = false;
    },

    async changeFlag(row) {
      row.pick = !row.pick;
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
            let internshipId = element.id;
            await axios.$post("/internship/delete", {
              internshipId: internshipId
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
        await axios.$post("/internship/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    async exportData() {
      let data = await axios.$download("/internship/export", {
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
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.count = parseInt(this.ruleForm.count);
          this.ruleForm.hours = parseInt(this.ruleForm.hours);
          console.log(this.ruleForm);
          this.updataCache();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          console.log(this.rules.count, "========count");
          for (let i = 0; i < this.ruleForm.teacherArr.length; i++) {
            let element = this.ruleForm.teacherArr[i];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                let info = element[key];
                if (key == "name") {
                  this.ruleForm.teachers += info;
                }
                if (key == "title") {
                  this.ruleForm.teachers += "|" + info;
                }
                if (key == "flag") {
                  if (info) {
                    this.ruleForm.teachers += "|1,";
                  } else {
                    this.ruleForm.teachers += "|0,";
                  }
                }
              }
            }
            if (i == this.ruleForm.teacherArr.length - 1) {
              this.ruleForm.teachers = this.ruleForm.teachers.substr(
                0,
                this.ruleForm.teachers.length - 1
              );
            }
          }
          console.log(this.ruleForm.teachers);
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];
              if (!element && key != "id") {
                this.ruleForm.teachers = "";
                console.log(element, "==========element===" + key);
                this.$message({
                  type: "info",
                  message: "请填写正确数据"
                });
                return;
              }
            }
          }
          await axios.$post("/internship/add", this.ruleForm);
          break;
        case "edit":
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id.toString();
            }
          }
          await axios.$post("/internship/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;

      await this.list();
    },
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.addressArr.push({
        value: this.ruleForm.address
      });
      this.addressArr = _.uniqWith(this.addressArr, _.isEqual);
      localStorage.setItem("addressArr", JSON.stringify(this.addressArr));

      this.classesArr.push({
        value: this.ruleForm.classes
      });
      this.classesArr = _.uniqWith(this.classesArr, _.isEqual);
      localStorage.setItem("classesArr", JSON.stringify(this.classesArr));

      this.companyArr.push({
        value: this.ruleForm.company
      });
      this.companyArr = _.uniqWith(this.companyArr, _.isEqual);
      localStorage.setItem("companyArr", JSON.stringify(this.companyArr));
    },
    queryAddress(queryString, cb) {
      var addressArr = this.addressArr;
      var results = queryString
        ? addressArr.filter(this.createAddressArrFilter(queryString))
        : addressArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createAddressArrFilter(queryString) {
      return addressArr => {
        return (
          addressArr.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    queryClasses(queryString, cb) {
      var classesArr = this.classesArr;
      var results = queryString
        ? classesArr.filter(this.createClassesArrFilter(queryString))
        : classesArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createClassesArrFilter(queryString) {
      return classesArr => {
        return (
          classesArr.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    uploadSuccess() {
      console.log("GHS");
      this.list();
    },
    queryCompany(queryString, cb) {
      var companyArr = this.companyArr;
      var results = queryString
        ? companyArr.filter(this.createCompanyArrFilter(queryString))
        : companyArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createCompanyArrFilter(queryString) {
      return companyArr => {
        return (
          companyArr.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    addTeacher() {
      this.ruleForm.teacherArr.push({
        name: "",
        title: "",
        flag: ""
      });
    },
    removeTeacher(item) {
      console.log(item);
      var index = this.ruleForm.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.teacherArr.splice(index, 1);
      }
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.read = false;
        this.ruleForm = {
          year: "",
          teacherArr: [
            {
              name: "",
              title: "",
              flag: false
            }
          ],
          type: "",
          hours: 0,
          count: 0,
          teachers: "",
          english: "0",
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
      } else {
        this.ruleForm = row;
        this.ruleForm.teacherArr = [];
        let teacherInfo = row.teachers.split(",");
        for (let i = 0; i < teacherInfo.length; i++) {
          const element = teacherInfo[i];
          this.ruleForm.teacherArr.push({
            name: "",
            title: "",
            flag: false
          });
          let teacher = element.split("|");
          for (let j = 0; j < teacher.length; j++) {
            const item = teacher[j];
            console.log(item, "======item");
            if (j == 0) {
              this.ruleForm.teacherArr[i].name = this.ruleForm.userName.split(
                ","
              )[i];
            } else if (j == 1) {
              this.ruleForm.teacherArr[i].title = item;
            } else {
              if (item == 0) {
                this.ruleForm.teacherArr[i].flag = false;
              } else {
                this.ruleForm.teacherArr[i].flag = true;
              }
            }
          }
        }
        this.ruleForm.auditFlag = row.auditFlag.toString();
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
          let internshipId = row.id;
          await axios.$post("/internship/delete", {
            internshipId: internshipId
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
    async queryTeacher(queryString, cb) {
      console.log(queryString);
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString
      });
      var teachers = [];
      for (let i = 0; i < teacher.length; i++) {
        const element = teacher[i];
        teachers.push({ value: element.name, id: element.id });
      }
      console.log(teachers);
      var results = queryString
        ? teachers.filter(this.createFilter(queryString))
        : teachers;
      cb(results);
    },
    createFilter(queryString) {
      return teacher => {
        return (
          teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    checkCanUse() {
      this.roles = window.localStorage.getItem("roles")
        ? JSON.parse(window.localStorage.getItem("roles"))
        : [];
      let userId = window.localStorage.getItem("userId") || "";
      console.log("检测权限：", this.roles);
      if (this.roles.indexOf(777) != -1) {
        this.showFunctionList = true;
      } else {
        this.loginUserId = userId;
      }
      if (this.roles.indexOf(888) != -1) {
        this.showTeachInput = true;
      } else {
        this.showTeachInput = false;
      }
    }
  },

  async mounted() {
    this.checkCanUse();
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.list();
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    this.roleId = localStorage.getItem("roleId");
    console.log(JSON.parse(localStorage.getItem("teachers"))[0]);
    this.addressArr = localStorage.getItem("addressArr")
      ? JSON.parse(localStorage.getItem("addressArr"))
      : [];
    this.classesArr = localStorage.getItem("classesArr")
      ? JSON.parse(localStorage.getItem("classesArr"))
      : [];
    this.companyArr = localStorage.getItem("companyArr")
      ? JSON.parse(localStorage.getItem("companyArr"))
      : [];
  }
};
</script>

<style>
.el-autocomplete {
  width: 100%;
}

.list {
  background-color: rgba(255, 255, 255, 0);
  border: none;
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