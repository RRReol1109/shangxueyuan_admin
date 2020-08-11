<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="类型:">
          <el-select v-model="query.type" size="normal" placeholder="请选择类型">
            <el-option label="全部" value></el-option>
            <el-option label="著作" value="著作"></el-option>
            <el-option label="教材" value="教材"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="著作/教材名称:">
          <el-input id="nameBox" v-model="query.name" placeholder="请输入著作/教材名称" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="出版社名称:">
          <el-input id="nameBox" v-model="query.publishHouse" placeholder="请输入出版社名称" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="署名单位:">
          <el-input id="nameBox" v-model="query.signature" placeholder="请输入出版社名称" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="出版时间:">
          <el-date-picker
            v-model="query.publishDate"
            type="date"
            placeholder="选择日期时间"
            size="normal"
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
                  :on-success="fileUploadSuccess"
                  action="http://bs.hk.darkal.cn/textbook/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传数据</el-button>
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
      v-loading="loading"
      id="table1"
      @selection-change="handleSelectionChange"
    >
      <el-table-column sortable align="center" type="selection" width="50"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        type="index"
        label="序号"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="type" label="类型" align="center"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="publishDate"
        align="center"
        label="出版时间"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="name"
        align="center"
        label="著作教程名称"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="publishHouse"
        align="center"
        label="出版社名称"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="signature"
        align="center"
        label="署名单位"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="chiefEditor"
        align="center"
        label="主编信息"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="reprintFlag"
        align="center"
        label="是否为再版"
      >
        <template slot-scope="scope">
          <span>{{scope.row.reprintFlag | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="translateFlag"
        align="center"
        label="是否国外教材译本"
      >
        <template slot-scope="scope">
          <span>{{scope.row.translateFlag | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="wordCount"
        align="center"
        label="总字数（万）"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="userName"
        align="center"
        label="作者"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="isbn"
        align="center"
        label="ISBN编号"
      ></el-table-column>
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
      <el-table-column sortable fixed="right" align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text" size="normal">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="normal">删除</el-button>
          <!-- <a class='download' :href='(scope.row.files)' download=""  title="下载">下载</a> -->
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
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-form
        :disabled="!['edit', 'add'].includes(operate)"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度">
              <el-date-picker
                size="normal"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
                style="width:98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类型" style="width:98%">
                <el-option label="著作" value="著作"></el-option>
                <el-option label="教材" value="教材"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出版时间" prop="publishDate">
              <el-date-picker
                v-model="ruleForm.publishDate"
                type="date"
                placeholder="选择日期时间"
                style="width:98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ISBN编号" prop="isbn">
              <el-input clearable v-model="ruleForm.isbn" placeholder="请输入内容" style="width:98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="著作/教材名称" prop="name">
          <el-input clearable v-model="ruleForm.name" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="附件" prop="files">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="uploadSuccess"
            action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="出版社名称" prop="publishHouse">
          <el-autocomplete
            clearable
            v-model="ruleForm.publishHouse"
            :fetch-suggestions="queryProjects"
            placeholder="请输入内容"
            style="width:99%"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="署名单位" prop="signature">
          <el-autocomplete
            clearable
            v-model="ruleForm.signature"
            :fetch-suggestions="queryProjects"
            style="width:99%"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总字数（万）" prop="wordCount">
              <el-input
                clearable
                v-model="ruleForm.wordCount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                placeholder="请输入内容"
                style="width:98%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主编信息" prop="chiefEditor">
          <el-input clearable v-model="ruleForm.chiefEditor" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否为再版" prop="reprintFlag">
              <el-select placeholder="请选择" v-model="ruleForm.reprintFlag" style="width:98%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否国外教材译本" prop="translateFlag">
              <el-select placeholder="请选择" v-model="ruleForm.translateFlag" style="width:98%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-for="(teacherArr, index) in teacherArr"
          :label="'作者信息' + (index+1)"
          :key="teacherArr.key"
          :prop="'teacherArr' + index"
        >
          <el-select v-model="teacherArr.name" filterable placeholder="请选择老师" prop="name">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <!--分数： <el-input
            clearable
            style="width:120px"
            v-model="teacherArr.point"
            placeholder="请输入分数"
            label="字数"
          ></el-input>-->
          字数(万)：
          <el-input clearable style="width:120px" v-model="teacherArr.num" placeholder="请输入字数"></el-input>
          <el-button type="danger" style="width:100px;" @click="removeTeacher(teacherArr)">删除</el-button>
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
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
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
        auditFlag: "0",
      },
      checkedList: [],
      deptid: "",
      teacherList: [],
      roleId: 0,
      examineDialog: false,
      dialogFormVisible: false,
      formDisabled: false,
      courseNames: [],
      yearsOptions: [],
      loading: true,
      page: 1,
      fileurl: "",
      additionFiles: [],
      cFlag: false,
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: "",
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
        publishDate: moment().format("YYYY-MM-DD"),
      },
      teacherArr: [{ name: "", point: "", num: "" }],
      tableData: [],
      rules: {
        publishHouse: [
          { required: true, message: "请输入出版社名称", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入著作/教材名称", trigger: "blur" },
        ],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
        signature: [
          { required: true, message: "请输入署名单位", trigger: "blur" },
        ],
        wordCount: [
          { required: true, message: "请输入总字数", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" },
        ],
        authors: [{ required: true, message: "请输入作者", trigger: "blur" }],
        isbn: [{ required: true, message: "请输入ISBN编号", trigger: "blur" }],
        year: [{ required: true, message: "请输入年度", trigger: "blur" }],
      },
      pressNames: [],
    };
  },
  filters: {
    statusFilter: function (value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过",
      }[value.toString()];
    },
    flagFilter: function (value) {
      return {
        true: "是",
        false: "否",
      }[value.toString()];
    },
  },
  mounted() {
    this.publishHouse = localStorage.getItem("publishHouse")
      ? JSON.parse(localStorage.getItem("publishHouse"))
      : [];
  },

  methods: {
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    async uploadAdditionSuccess(response) {
      console.log("this.ruleForm:::", this.ruleForm);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response,
        });
        if (this.operate == "edit") {
          this.ruleForm.files = JSON.stringify(this.additionFiles);
          await axios.$post("/textbook/update", this.ruleForm);
        }
      }
    },
    downloadAdditionFile(row) {
      window.open(row.name);
    },
    async deleteAdditionFile(row) {
      this.additionFiles = this.additionFiles.filter(
        (it) => it.name !== row.name
      );
      if (this.operate == "edit") {
        this.ruleForm.files = JSON.stringify(this.additionFiles);
        await axios.$post("/textbook/update", this.ruleForm);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.pressNames.push({
        value: this.ruleForm.publishHouse,
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
      return (pressNames) => {
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
          message: "该条记录无附件",
        });
      }
    },
    addAuthor() {
      this.ruleForm.author.push({
        value: "",
        key: Date.now() + "author",
      });
      this.ruleForm.point.push({
        value: "",
        key: Date.now() + "point",
      });
      this.ruleForm.word.push({
        value: "",
        key: Date.now() + "word",
      });
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
      var index = this.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.teacherArr.splice(index, 1);
      }
    },
    addTeacher() {
      this.teacherArr.push({
        name: "",
        point: "",
        num: "",
      });
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/textbook/export?id=-1", {});
      } else {
        data = await axios.$download("/textbook/export", {
          params: this.query,
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-著作教材.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      if (this.additionFiles)
        this.ruleForm.files = JSON.stringify(this.additionFiles);
      let verification = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          verification = true;
          console.log("success");
          return true;
        } else {
          verification = false;
          this.ruleForm.authors = "";
          console.log("error submit!!");
          return false;
        }
      });
      if (verification) {
      } else {
        this.$message({
          type: "info",
          message: "请填写正确数据",
        });
        return;
      }
      switch (this.operate) {
        case "add":
          console.log(this.ruleForm);
          this.ruleForm.files = this.fileurl;
          console.log(this.teacherList);
          for (let i = 0; i < this.teacherArr.length; i++) {
            let element = this.teacherArr[i];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                let info = element[key];
                console.log(info);
                if (key == "name") {
                  this.ruleForm.authors += info;
                }
                // if (key == "point") {
                //   this.ruleForm.authors += "|" + info;
                // }
                if (key == "num") {
                  this.ruleForm.authors += "|" + info + ",";
                }
              }
            }
            if (i == this.teacherArr.length - 1) {
              this.ruleForm.authors = this.ruleForm.authors.substr(
                0,
                this.ruleForm.authors.length - 1
              );
            }
          }
          await axios.$post("/textbook/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          this.ruleForm.authors = "";
          for (let i = 0; i < this.teacherArr.length; i++) {
            let element = this.teacherArr[i];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                let info = element[key];
                let tid = "";
                if (key == "name") {
                  for (let j = 0; j < this.teacherList.length; j++) {
                    const item = this.teacherList[j];
                    if (info == item.name) {
                      tid = item.id;
                    }
                  }
                  if (tid) this.ruleForm.authors += tid;
                  else this.ruleForm.authors += info;
                }
                // if (key == "point") {
                //   this.ruleForm.authors += "|" + info;
                // }
                if (key == "num") {
                  this.ruleForm.authors += "|" + info + ",";
                }
              }
            }
            if (i == this.teacherArr.length - 1) {
              this.ruleForm.authors = this.ruleForm.authors.substr(
                0,
                this.ruleForm.authors.length - 1
              );
            }
          }
          await axios.$post("/textbook/update", this.ruleForm);
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
          type: "warning",
        }).then(async () => {});
        return;
      }
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
          editor: JSON.parse(localStorage.getItem("userInfo")).id,
        };
        this.teacherArr = [
          {
            name: "",
            point: "",
            num: "",
          },
        ];
        this.additionFiles = [];
      } else {
        this.ruleForm = row;
        this.teacherArr = [];
        if (row.files) this.additionFiles = JSON.parse(row.files);
        let teacherInfo = row.authors.split(",");
        for (let i = 0; i < teacherInfo.length; i++) {
          const element = teacherInfo[i];
          this.teacherArr.push({
            name: "",
            point: "",
            num: "",
          });
          let teacher = element.split("|");
          for (let j = 0; j < teacher.length; j++) {
            const item = teacher[j];
            console.log(item, "======item");
            if (j % 2 == 0) {
              this.teacherArr[i].name = this.ruleForm.userName.split(",")[i];
            } else {
              this.teacherArr[i].num = item;
            }
          }
        }
        this.ruleForm.auditFlag = row.auditFlag.toString();
        this.dwurl = row.files;
      }
    },
    fileUploadSuccess(res, file, files) {
      this.$message({
        type: "success",
        message: "上传成功",
      });
      this.list();
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
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let textbookId = row.id;
          await axios.$post("/textbook/delete", {
            textbookId: textbookId,
          });
          this.list();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData(command);
          break;
        case "examine":
          if (this.checkedList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
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

    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async delCount() {
      let vm = this;
      if (this.checkedList.length == 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {});
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          for (let i = 0; i < vm.checkedList.length; i++) {
            await axios.$post("/textbook/delete", {
              textbookId: vm.checkedList[i].id,
            });
          }
          this.tableData = [];
          await this.list();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
          await axios.$post("/textbook/update", this.examineForm);
        } else {
          this.examineForm.auditFlag = 2;
          await axios.$post("/textbook/update", this.examineForm);
        }
      }
      this.$message({
        type: "success",
        message: "审核成功!",
      });
      this.examineDialog = false;
      this.list();
    },
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999,
      });
    },
  },

  async mounted() {
    await this.queryTeacher();
    this.header = {
      Authorization: localStorage.getItem("message"),
    };
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999,
    });
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    this.teacherList = this.teacherList.rows;
    await this.list();
    this.roleId = localStorage.getItem("roleId");
  },
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