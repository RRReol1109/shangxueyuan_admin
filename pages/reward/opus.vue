<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="类型:">
          <el-select v-model="query.type" size="small" placeholder="请选择类型">
            <el-option label="全部" value></el-option>
            <el-option label="著作" value="著作"></el-option>
            <el-option label="教材" value="教材"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="著作/教材名称:">
          <el-input id="nameBox" v-model="query.name" placeholder="请输入著作/教材名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="出版社名称:">
          <el-input id="nameBox" v-model="query.publishHouse" placeholder="请输入出版社名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="署名单位:">
          <el-input id="nameBox" v-model="query.signature" placeholder="请输入出版社名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="出版时间:">
          <el-date-picker v-model="query.publishDate" type="date" placeholder="选择日期时间" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label v-if="deptid==31||roleId==1">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item v-if="deptid==31||roleId==1">
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
                  :on-success="fileUploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/textbook/upload?token='AuthenticationToken'"
                >
                  <el-button size="small" class type="text">批量上传数据</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" id="table1">
      <el-table-column prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)" name="checks" :checked="cFlag"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="year" align="center" label="年度"></el-table-column>
      <el-table-column prop="publishDate" align="center" label="出版时间"></el-table-column>
      <el-table-column prop="name" align="center" label="著作教程名称"></el-table-column>
      <el-table-column prop="publishHouse" align="center" label="出版社名称"></el-table-column>
      <el-table-column prop="signature" align="center" label="署名单位"></el-table-column>
      <el-table-column prop="wordCount" align="center" label="总字数（万）"></el-table-column>
      <el-table-column prop="userName" align="center" label="作者"></el-table-column>
      <el-table-column prop="isbn" align="center" label="ISBN编号"></el-table-column>
      <el-table-column prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200"  v-if="deptid==31||roleId==1">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="downLoadFile(scope.row)" type="text" size="small">附件下载</el-button>
          <!-- <a class='download' :href='(scope.row.files)' download=""  title="下载">下载</a> -->
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
            <el-button @click="examineDialog = false" size="small" disabled>取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer size="40%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <el-form
        :disabled="!['edit', 'add'].includes(operate)"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="年度:">
          <el-date-picker
            size="small"
            v-model="ruleForm.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-col :span="12">
            <el-select v-model="ruleForm.type" placeholder="请选择类型">
              <el-option label="著作" value="著作"></el-option>
              <el-option label="教材" value="教材"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="出版时间" prop="publishDate">
          <el-col :span="12">
            <el-date-picker v-model="ruleForm.publishDate" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="著作/教材名称" prop="name">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.name" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="uploadSuccess"
            action="http://bsoa.csu.edu.cn/bs/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="small" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="ISBN编号" prop="isbn">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.isbn" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="出版社名称" prop="publishHouse">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.publishHouse"
              :fetch-suggestions="queryProjects"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="署名单位" prop="signature">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.signature"
              :fetch-suggestions="queryProjects"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-col>
        </el-form-item>
        <el-form-item label="总字数（万）" prop="wordCount">
          <el-col :span="12">
            <el-input
              clearable
              v-model="ruleForm.wordCount"
              oninput="value=value.replace(/[^\d.]/g,'')"
              placeholder="请输入内容"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          v-for="(teacherArr, index) in ruleForm.teacherArr"
          :label="'作者信息' + (index+1)"
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
            <el-input
              clearable
              v-model="teacherArr.point"
              oninput="value=value.replace(/[^\d.]/g,'')"
              placeholder="请输入分数"
              label="字数"
            ></el-input>
            <el-input
              clearable
              v-model="teacherArr.num"
              oninput="value=value.replace(/[^\d.]/g,'')"
              placeholder="请输入字数"
            ></el-input>
            <el-button style="width:200px;" @click="removeTeacher(teacherArr)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-if="!['show'].includes(operate)">
          <el-button type="primary" @click="addTeacher('ruleForm')">继续添加老师</el-button>
        </el-form-item>
        <!-- <el-form-item label="作者:" :prop="'authors'">
          <el-col :span="12">
            <label>教师id-教师姓名</label>
            <el-input v-model="ruleForm.authors" :rows="5" type="textarea" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="small" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
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
      total: 0,
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      deptid: "",
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      dialogFormVisible: false,
      formDisabled: false,
      courseNames: [],
      yearsOptions: [],
      loading: false,
      page: 1,
      fileurl: "",
      cFlag: false,
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      dwurl: "",
      header: {},
      fileList: [],
      operate: "",
      fileLists: [],
      ruleForm: {
        type: "1",
        name: "",
        publishHouse: "",
        signature: "",
        wordCount: 0,
        teacherArr: [{ name: "", point: "", num: "" }],
        publishDate: moment().format("YYYY-MM-DD")
      },
      tableData: [],
      rules: {
        publishHouse: [
          { required: true, message: "请输入出版社名称", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入著作/教材名称", trigger: "blur" }
        ],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
        signature: [
          { required: true, message: "请输入署名单位", trigger: "blur" }
        ],
        wordCount: [
          { required: true, message: "请输入总字数", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        authors: [{ required: true, message: "请输入作者", trigger: "blur" }],
        isbn: [{ required: true, message: "请输入ISBN编号", trigger: "blur" }],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }]
      },
      pressNames: []
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
  mounted() {
    this.publishHouse = localStorage.getItem("publishHouse")
      ? JSON.parse(localStorage.getItem("publishHouse"))
      : [];
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.pressNames.push({
        value: this.ruleForm.publishHouse
      });
      this.pressNames = _.uniqWith(this.pressNames, _.isEqual);
      localStorage.setItem("pressNames", JSON.stringify(this.pressNames));
    },
    queryProjects(queryString, cb) {
      var pressNames = this.pressNames;
      var results = queryString
        ? pressNames.filter(this.createProjectsFilter(queryString))
        : pressNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createProjectsFilter(queryString) {
      return pressNames => {
        return (
          pressNames.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    removeAuthor(item) {
      var index = this.ruleForm.author.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.author.splice(index, 1);
      }
    },
    removePoint(item) {
      var index = this.ruleForm.point.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.point.splice(index, 1);
      }
    },

    removeWord(item) {
      var index = this.ruleForm.word.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.word.splice(index, 1);
      }
    },
    downLoadFile(rows) {
      if (rows.files) {
        window.open(rows.files);
      } else {
        this.$message({
          type: "info",
          message: "该条记录无附件"
        });
      }
    },
    addAuthor() {
      this.ruleForm.author.push({
        value: "",
        key: Date.now() + "author"
      });
      this.ruleForm.point.push({
        value: "",
        key: Date.now() + "point"
      });
      this.ruleForm.word.push({
        value: "",
        key: Date.now() + "word"
      });
    },

    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      this.loading = true;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "publishDate") {
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
        this.query.editor = localStorage.getItem("userId");
      }
      let res = await axios.$post("/textbook/list", this.query);
      this.tableData = res.rows;
      for (let i = 0; i < res.rows.length; i++) {
        const element = res.rows[i];
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            const item = element[key];
            // if (key == "authors") {
            //   let authors = item.toString().split(",");
            //   for (let j = 0; j < authors.length; j++) {
            //     const author = authors[j].split("|");
            //     console.log(j, "-0--j");
            //     for (let x = 0; x < author.length; x++) {
            //       const point = author[x];
            //       console.log(point, "ponit");
            //       if (x != 0 || x % 2 != 0) {
            //         console.log();
            //         this.tableData[i].authors = point;
            //       }
            //     }
            //   }
            // }
          }
        }
      }

      this.total = parseInt(res.total);
      this.loading = false;
    },
    removeTeacher(item) {
      console.log(item);
      var index = this.ruleForm.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.teacherArr.splice(index, 1);
      }
    },
    addTeacher() {
      this.ruleForm.teacherArr.push({
        name: "",
        point: "",
        num: ""
      });
    },
    async exportData() {
      let data = await axios.$download("/textbook/export", {
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
          console.log(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          console.log(this.ruleForm);
          this.ruleForm.files = this.fileurl;
          console.log(this.teacherList);
          for (let i = 0; i < this.ruleForm.teacherArr.length; i++) {
            let element = this.ruleForm.teacherArr[i];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                let info = element[key];
                console.log(info);
                if (key == "name") {
                  this.ruleForm.authors += info;
                }
                if (key == "point") {
                  this.ruleForm.authors += "|" + info;
                }
                if (key == "num") {
                  this.ruleForm.authors += "|" + info + ",";
                }
              }
            }
            if (i == this.ruleForm.teacherArr.length - 1) {
              this.ruleForm.authors = this.ruleForm.authors.substr(
                0,
                this.ruleForm.authors.length - 1
              );
            }
          }
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];
              if (!element && key != "auditFlag" && key != "files") {
                this.ruleForm.authors = "";
                console.log(element, "==========element===" + key);
                this.$message({
                  type: "info",
                  message: "请填写正确数据"
                });
                return;
              }
            }
          }
          await axios.$post("/textbook/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          await axios.$post("/textbook/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          type: "著作",
          name: "",
          publishHouse: "",
          signature: "",
          wordCount: 0,
          year: "",
          authors: "",
          isbn: "",
          publishDate: moment().format("YYYY-MM-DD"),
          teacherArr: [
            {
              name: "",
              point: "",
              num: ""
            }
          ],
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
      } else {
        this.ruleForm = row;
        this.ruleForm.teacherArr = [];
        let teacherInfo = row.authors.split(",");
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
              this.ruleForm.teacherArr[i].point = item;
            } else {
              this.ruleForm.teacherArr[i].num = item;
            }
          }
        }
        this.ruleForm.auditFlag = row.auditFlag.toString();
        this.dwurl = row.files;
      }
    },
    fileUploadSuccess(res, file, files) {
      console.log(files, "5645+9656+5");
      // this.list();
    },
    uploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
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
          let textbookId = row.id;
          await axios.$post("/textbook/delete", {
            textbookId: textbookId
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
          location.href = "http://112.74.56.60/excel/excel-model/kyjl-zzjc.xls";
          break;
      }
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
            let textbookId = element.id;
            await axios.$post("/textbook/delete", {
              textbookId: textbookId
            });
          }
          //   this.tableData = [];
          await this.list();
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
        await axios.$post("/textbook/update", this.examineForm);
      }
      this.tableData = [];
      await this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    },
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999
      });
    }
  },

  async mounted() {
    await this.queryTeacher();
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.teacherList = this.teacherList.rows;
    await this.list();
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>

<style>
.el-autocomplete {
  width: 100%;
}
el-from {
  overflow: auto;
}
el-input {
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