<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="论文名称:">
          <el-input v-model="query.title" style="width:250px" placeholder size="normal"></el-input>
        </el-form-item>
        <el-form-item label="第一作者:">
          <el-input v-model="query.authors" style="width:250px" placeholder size="normal"></el-input>
        </el-form-item>
        <el-form-item label="期刊学院分级:">
          <el-select v-model="query.collegeLevel" size="normal" placeholder="请选择分级">
            <el-option label="全部" value></el-option>
            <el-option label="中文A+" value="中文A+"></el-option>
            <el-option label="中文A" value="中文A"></el-option>
            <el-option label="中文A-" value="中文A-"></el-option>
            <el-option label="中文B" value="中文B"></el-option>
            <el-option label="中文C" value="中文C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期刊名称:">
          <el-input v-model="query.journal" style="width:250px" placeholder="请输入期刊名称" size="normal"></el-input>
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
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="downLoad">计算规则</el-button>
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
                  action="http://bs.hk.darkal.cn/articleCn/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传</el-button>
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
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="publishDate"
        align="center"
        label="发表日期"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="year"
        align="center"
        label="年度"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="reformPaper"
        align="center"
        label="是否为教改论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.reformPaper | reformPaperFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="200"
        :show-overflow-tooltip="true"
        prop="title"
        align="center"
        label="论文名称"
      ></el-table-column>
      <el-table-column
        sortable
        width="200"
        :show-overflow-tooltip="true"
        prop="journal"
        align="center"
        label="期刊名称"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="schoolLevel"
        align="center"
        label="学校期刊分级"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="collegeLevel"
        align="center"
        label="学院期刊分级"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="issn"
        align="center"
        label="期刊ISSN号"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="included"
        align="center"
        label="核心收录"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="subject"
        align="center"
        label="期刊所属学科"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="source"
        align="center"
        label="资助来源"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="yearDate"
        align="center"
        label="年代卷期"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="firstAuthor"
        align="center"
        label="第一作者"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="firstAuthorDept"
        align="center"
        label="第一作者单位"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="firstCorrespondent"
        align="center"
        label="第一通讯作者"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
        :show-overflow-tooltip="true"
        prop="firstCorrespondentDept"
        align="center"
        label="第一通讯作者单位"
      ></el-table-column>
      <el-table-column
        sortable
        width="300"
        :show-overflow-tooltip="true"
        prop="authors"
        align="center"
        label="全体作者"
      ></el-table-column>
      <el-table-column
        sortable
        width="150"
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
          <el-button
            @click="operate='edit';showDialog(scope.row)"
            type="text"
            size="normal"
            v-if="scope.row.auditFlag!=1"
          >编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="normal">删除</el-button>
          <el-button @click="goPaper(scope.row);" type="text">查看论文</el-button>
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

    <el-drawer title="提示" size="60%" style="min-height:500px" :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
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
            <el-form-item label="发表日期:" prop>
              <el-date-picker
                size="normal"
                style="width:98%"
                v-model="ruleForm.publishDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为教改论文" prop="reformPaper">
              <el-select v-model="ruleForm.reformPaper" placeholder="请选择级别" style="width:98%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="论文名称:" prop="title">
          <el-input learable v-model="ruleForm.title" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="论文rul:" prop="url">
          <el-input learable v-model="ruleForm.url" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="论文英文名称:" prop="titleEn">
          <el-input learable v-model="ruleForm.titleEn" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="期刊名称" prop="journal">
          <el-input v-model="ruleForm.journal" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="期刊ISSN号" prop="issn">
          <el-input clearable v-model="ruleForm.issn" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校期刊分级" prop="schoolLevel">
              <el-input v-model="ruleForm.schoolLevel" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院期刊分级" prop="collegeLevel">
              <el-select v-model="ruleForm.collegeLevel" placeholder="请选择级别" style="width:98%">
                <el-option label="中文A+" value="A+"></el-option>
                <el-option label="中文A" value="A"></el-option>
                <el-option label="中文A-" value="A-"></el-option>
                <el-option label="中文B" value="B"></el-option>
                <el-option label="中文C" value="C"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年代卷期" prop="yearDate">
              <el-input placeholder style="width:98%" v-model="ruleForm.yearDate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="核心收录" prop="included">
              <el-select placeholder="请选择" style="width:98%" v-model="ruleForm.included">
                <el-option label="CSCD" value="CSCD"></el-option>
                <el-option label="CSSCI" value="CSSCI"></el-option>
                <el-option label="CSCD扩展" value="CSCD扩展"></el-option>
                <el-option label="CSSCI扩展" value="CSSCI扩展"></el-option>
                <el-option label="北大核心" value="北大核心"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期刊所属学科" prop="subject">
              <el-input learable placeholder style="width:98%" v-model="ruleForm.subject"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资助来源" prop="source">
              <el-input clearable v-model="ruleForm.source" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第一作者" prop="firstAuthor">
              <el-input clearable v-model="ruleForm.firstAuthor" placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第一作者单位" prop="firstAuthorDept">
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.firstAuthorDept"
            placeholder
            style="width:99%"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第一通讯作者" prop="firstCorrespondent">
              <el-input
                clearable
                v-model="ruleForm.firstCorrespondent"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第一通讯作者单位" prop="firstCorrespondentDept">
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.firstCorrespondentDept"
            placeholder
            style="width:99%"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="全体作者" prop>
          <el-input
            @input="authorsChanged"
            type="textarea"
            clearable
            placeholder
            v-model="ruleForm.authors"
            style="width:99%"
          ></el-input>
          <span style="color:#F56C6C">例子：学生1（老师甲），老师乙2（外单位），老师甲1 注:老师甲为通讯作者</span>
        </el-form-item>-->
        <!--<el-row>
          <el-col :span="12">
            <el-form-item label="作者人数" prop>
              <el-input v-model="ruleForm.authorCnt" placeholder style="width:98%"></el-input>
              <span style="color:#F56C6C">作者人数自动计算，可自行修改</span>
            </el-form-item>
          </el-col>
        </el-row>-->
        <!-- <el-form-item label="计分" prop="score">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.score" placeholder="请输入内容"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-form-item
            v-for="(teacherArr, index) in teacherArr"
            :label="'作者信息' + (index+1)"
            :key="teacherArr.key"
            :prop="'teacherArr' + index"
          >
            <el-autocomplete
              v-model="teacherArr.name"
              style="width:15%;"
              placeholder="请输入教师"
              :fetch-suggestions="queryTeachers"
            ></el-autocomplete>学生姓名:
            <el-input clearable style="width:120px" v-model="teacherArr.stu" placeholder="请输入姓名"></el-input>是否是外单位:
            <el-select clearable v-model="teacherArr.company" placeholder="请选择" style="width:15%;">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>是否是通讯作者:
            <el-select clearable v-model="teacherArr.flag" placeholder="请选择" style="width:15%;">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
            <el-button type="danger" style="width:100px;" @click="removeTeacher(teacherArr)">删除</el-button>
          </el-form-item>
          <el-form-item v-if="!['show'].includes(operate)">
            <el-button type="primary" @click="addTeacher('ruleForm')">继续添加作者</el-button>
          </el-form-item>
        </el-row>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
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
      header: {},
      operate: "",
      fileLoading: false,
      fileData: "",
      action: "",
      checkedList: [],
      dialogFormVisible: false,
      total: 0,
      fileLists: [],
      page: 1,
      yearsOptions: [],
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      deptid: "",
      teacherList: [],
      fileList: [],
      operate: "",
      fileurl: "",
      additionFiles: [],
      ruleForm: {
        files: "",
        title: "",
        journal: "",
        collegeLevel: "1",
        half: 0,
        score: "",
        finalScore: "",
        cateNumber: ""
      },
      teacherArr: [
        {
          name: "",
          stu: "",
          company: "false",
          flag: "false"
        }
      ],
      loading: true,
      roleId: 0,
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      examineDialog: false,
      tableData: [],
      rules: {
        title: [{ required: true, message: "请输入论文名称", trigger: "blur" }],
        journal: [
          { required: true, message: "请输入期刊名称", trigger: "blur" }
        ],
        authorName: [
          { required: true, message: "请输入作者", trigger: "blur" }
        ],
        score: [
          { required: true, message: "请输入本人计分", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],

        cateNumber: [
          { required: true, message: "请输入期刊ISSN号", trigger: "blur" }
        ],
        authors: [{ required: true, message: "请输入作者", trigger: "blur" }],
        half: [{ required: true, message: "请选择是否半价", trigger: "blur" }],
        collegeLevel: [
          { required: true, message: "请选择分级", trigger: "blur" }
        ],
        // year: [{ required: true, message: "请输入年份", trigger: "blur" }],
        title: [{ required: true, message: "请输入论文名称", trigger: "blur" }]
        // files: [{ required: true, message: "请上传附件", trigger: "blur" }]
      }
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "通过",
        "2": "未通过"
      }[value.toString()];
    },
    reformPaperFilter: function(value) {
      return {
        true: "是",
        false: "否"
      }[value.toString()];
    }
  },
  methods: {
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    authorsChanged(value) {
      this.ruleForm.authorCnt = 0;
      const arrays = value.split(",");
      arrays.forEach(row => {
        if (row) {
          this.ruleForm.authorCnt++;
        }
      });
    },
    async uploadAdditionSuccess(response) {
      console.log("this.ruleForm:::", this.ruleForm);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.ruleForm.files = JSON.stringify(this.additionFiles);
          await axios.$post("/articleCn/update", this.ruleForm);
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
        this.ruleForm.files = JSON.stringify(this.additionFiles);
        await axios.$post("/articleCn/update", this.ruleForm);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.names.push({
        value: this.ruleForm.name
      });
      this.names = _.uniqWith(this.names, _.isEqual);
      localStorage.setItem("names", JSON.stringify(this.names));

      this.stuNames.push({
        value: this.ruleForm.stuName
      });
      this.stuNames = _.uniqWith(this.stuNames, _.isEqual);
      localStorage.setItem("stuNames", JSON.stringify(this.stuNames));
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
        stu: "",
        company: "false",
        flag: "false"
      });
    },
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999
      });
      this.teacherList = this.teacherList.rows;
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
    async list() {
      this.loading = true;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "endDate" || key == "startDate") {
            console.log(typeof element);
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
            console.log(element);
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
      let res = await axios.$post("/articleCn/list", this.query);
      this.tableData = res.rows;
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        // let teachers = this.tableData[i].authors.split("|");
        // for (let j = 0; j < teachers.length; j++) {
        //   const item = teachers[j];
        // }
      }
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async queryTeachers(queryString, cb) {
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString
      });
      var teachers = [];
      for (let i = 0; i < teacher.length; i++) {
        const element = teacher[i];
        teachers.push({ value: element.name, id: element.id });
      }
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
    downLoad() {
      window.open("http://bsoa.csu.edu.cn/files/中文论文分级标准.zip");
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/articleCn/export?id=-1", {});
      } else {
        data = await axios.$download("/articleCn/export", {});
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-中文论文.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      if (this.additionFiles)
        this.ruleForm.files = JSON.stringify(this.additionFiles);
      let verification = false;
      this.$refs[formName].validate(valid => {
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
          message: "请填写正确数据"
        });
        return;
      }
      this.ruleForm.authors = "";
      this.ruleForm.year = this.ruleForm.publishDate
        ? this.ruleForm.publishDate.substr(0, 4)
        : "";
      for (let i = 0; i < this.teacherArr.length; i++) {
        const element = this.teacherArr[i];
        let author = "";
        if (element.stu != "") {
          if (element.flag == "true") {
            author += element.stu + 1;
          } else {
            author += element.stu + (i + 1);
          }
          author += "（" + element.name + "）";
        } else {
          author += element.name;
        }
        if (element.flag == "true" && element.stu == "") {
          author += 1;
        } else if (element.flag == "false" && element.stu == "") {
          author += i + 1;
        }
        if (element.company == "true") {
          author += "（外单位）";
        } else {
          author += "（中南大学）";
        }
        this.ruleForm.authors += author;
        if (i != this.teacherArr.length - 1) {
          this.ruleForm.authors += "，";
        }
      }
      switch (this.operate) {
        case "add":
          this.ruleForm.files = this.fileurl;
          await axios.$post("/articleCn/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          await axios.$post("/articleCn/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    goPaper(row) {
      if (row.url != undefined && row.url != "") {
        window.open(row.url);
      } else {
        this.$confirm("该条数据无论文url", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
      }
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          id: "",
          title: "",
          journal: "",
          collegeLevel: "",
          half: "",
          score: "",
          authors: "",
          finalScore: "",
          cateNumber: "",
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        this.teacherArr = [
          {
            name: "",
            stu: "",
            company: "false",
            flag: "false"
          }
        ];
        this.additionFiles = [];
      } else {
        this.ruleForm = row;
        if (row.files) this.additionFiles = JSON.parse(row.files);
        this.teacherArr = [];
        let teacherInfo = row.authors.split("，");
        console.log(teacherInfo.length);
        for (let i = 0; i < teacherInfo.length; i++) {
          let author = "";
          let name = "";
          let flag = "";
          let stu = "";
          let company = "";
          const element = teacherInfo[i];
          if (element.indexOf("（") == -1) {
            name = element.substr(0, element.length - 1);
            if (element.substr(element.length - 1, 1) == "1" && i != 0) {
              flag = "true";
            } else {
              flag = "false";
            }
            company = "false";
          } else {
            let info = element.substr(
              element.indexOf("（") + 1,
              element.indexOf("）") - element.indexOf("（") - 1
            );
            if (info != "外单位" && info != "中南大学") {
              name = info;
              company = "false";
              stu = element.substr(0, element.indexOf("（") - 1);
            } else {
              name = element.substr(0, element.indexOf("（") - 1);
              if (info == "外单位") company = "true";
              else company = "false";
            }
            if (element.substr(element.indexOf("（") - 1, 1) == 1 && i != 0) {
              flag = "true";
            } else {
              flag = "false";
            }
          }
          author = {
            name: name,
            stu: stu,
            company: company,
            flag: flag
          };
          this.teacherArr.push(author);
        }

        this.ruleForm.auditFlag = row.auditFlag.toString();
        this.ruleForm.reformPaper = row.reformPaper.toString();
      }
    },

    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },

    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let articleCnId = row.id;
          await axios.$post("/articleCn/delete", {
            articleCnId: articleCnId
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
          this.exportData(command);
          break;
        case "examine":
          if (this.checkedList.length <= 0) {
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

    async changeFlag(row) {
      row.pick = !row.pick;
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
            await axios.$post("/articleCn/delete", {
              articleCnId: vm.checkedList[i].id
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

    async examineData(flag) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.examineForm.id = this.checkedList[i].id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/articleCn/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    }
  },
  async mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    await this.queryTeacher();
    await this.list();
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>

<style>
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.el-autocomplete {
  width: 100%;
}
el-from {
  overflow: auto;
}

#authorBox {
  width: 600px;
}
</style>