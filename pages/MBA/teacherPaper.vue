<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="normal"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年级"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="导师姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
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
                  action="http://bs.hk.darkal.cn/teacherPaper/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" height="600">
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="teacherId" align="center" label="教职工工号"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="name" align="center" label="教职工姓名"></el-table-column>
      <!-- <el-table-column sortable :show-overflow-tooltip="true" prop="entrance" align="center" label="序号"></el-table-column> -->
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="studentAuthor"
        align="center"
        label="研究生作者姓名"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="studentType"
        align="center"
        label="研究生类别"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="studentGrade"
        align="center"
        label="研究生年级"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="studentMajor"
        align="center"
        label="研究生专业"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="authorCnt" align="center" label="作者总数"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="tutorIndex" align="center" label="导师排名"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="studentIndex"
        align="center"
        label="研究生排名"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="author" align="center" label="全部作者列表"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="title" align="center" label="论文题目"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="journal" align="center" label="期刊名称"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="titleDate"
        align="center"
        label="获得现职称年月"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="publishInfo"
        align="center"
        label="出版年卷期"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="pageRange" align="center" label="起止页码"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="origin" align="center" label="检索源"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="esi" align="center" label="是否ESI期刊"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="level" align="center" label="院定级别"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="issn" align="center" label="期刊ISSN号"></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="impactFactor"
        align="center"
        label="期刊影响因子"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="timesCited"
        align="center"
        label="论文他引次数"
      ></el-table-column>
      <el-table-column sortable
        :show-overflow-tooltip="true"
        prop="pdfUrl"
        align="center"
        label="上传全文PDF电子版"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="point" align="center" label="业绩点"></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="score" align="center" label="考核分"></el-table-column>
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
      <el-form
        :model="form"
        :rules="rules"
        label-width="180px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份" prop="year">
              <el-date-picker
                v-model="form.year"
                type="date"
                format="yyyy"
                style="width:99%"
                value-format="yyyy"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教职工工号" prop="teacherId">
              <el-input size="normal" v-model="form.teacherId" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教职工姓名" prop="name">
              <el-input size="normal" v-model="form.name" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究生作者姓名" prop="studentAuthor">
              <el-input size="normal" v-model="form.studentAuthor" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究生类别" prop="studentType">
              <el-select
                v-model="form.studentType"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="硕士" value="硕士"></el-option>
                <el-option label="博士" value="博士"></el-option>
                <el-option label="博士后" value="博士后"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究生年级:" prop="studentGrade">
              <el-date-picker
                v-model="form.studentGrade"
                type="date"
                style="width:99%"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究生专业" prop="studentMajor">
              <el-select
                v-model="form.studentMajor"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="管理科学与工程" value="管理科学与工程"></el-option>
                <el-option label="工商管理" value="工商管理"></el-option>
                <el-option label="企业管理" value="企业管理"></el-option>
                <el-option label="金融学" value="金融学"></el-option>
                <el-option label="会计学" value="会计学"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者总数" prop="authorCnt">
              <el-input size="normal" v-model="form.authorCnt" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="导师排名" prop="tutorIndex">
              <el-input size="normal" v-model="form.tutorIndex" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研究生排名" prop="studentIndex">
              <el-input size="normal" v-model="form.studentIndex" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="全部作者列表" prop="author">
              <el-input size="normal" v-model="form.author" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="论文题目" prop="title">
              <el-input size="normal" v-model="form.title" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期刊名称" prop="journal">
              <el-input size="normal" v-model="form.journal" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获得现职称年月:" prop="titleDate">
              <el-date-picker
                v-model="form.titleDate"
                type="date"
                style="width:99%"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出版年卷期:" prop="publishInfo">
              <el-date-picker
                v-model="form.publishInfo"
                type="date"
                style="width:99%"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起止页码" prop="pageRange">
              <el-input size="normal" v-model="form.pageRange" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检索源" prop="origin">
              <el-select v-model="form.origin" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="SCI" value="SCI"></el-option>
                <el-option label="SSCI" value="SSCI"></el-option>
                <el-option label="EI" value="EI"></el-option>
                <el-option label="ISTP" value="ISTP"></el-option>
                <el-option label="A&ICSSCI" value="A&ICSSCI"></el-option>
                <el-option label="CSCD" value="CSCD"></el-option>
                <el-option label="人大复印" value="人大复印"></el-option>
                <el-option label="新华文摘" value="新华文摘"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否ESI期刊" prop="esi">
              <el-select v-model="form.esi" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="院定级别" prop="level" placeholder="请选择" style="width:99%">
              <el-select v-model="form.level" size="normal">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期刊ISSN号" prop="issn">
              <el-input size="normal" v-model="form.issn" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期刊影响因子" prop="impactFactor">
              <el-input size="normal" v-model="form.impactFactor" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="论文他引次数" prop="timesCited">
              <el-input size="normal" v-model="form.timesCited" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="上传全文PDF" prop="pdfUrl">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="fileUploadSuccess"
            action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
            </el-form-item>-->
            <el-form-item label="业绩点" prop="point">
              <el-input size="normal" v-model="form.point" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核分" prop="score">
              <el-input size="normal" v-model="form.score" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
            <el-table-column sortable
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
        <el-row>
          <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
            <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态" style="width:99%">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核未通过" value="2"></el-option>
            </el-select>
          </el-form-item>
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
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
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
      examineForm: {},
      header: {},
      rules: {},
      fileLists: [],
      fileurl: "",
      additionFiles: [],
      form: {
        year: "",
        teacherId: "",
        name: "",
        entrance: "",
        studentAuthor: "",
        studentType: "",
        studentGrade: "",
        studentMajor: "",
        authorCnt: "",
        tutorIndex: "",
        studentIndex: "",
        author: "",
        title: "",
        journal: "",
        titleDate: "",
        publishInfo: "",
        pageRange: "",
        origin: "",
        esi: "",
        level: "",
        issn: "",
        impactFactor: "",
        timesCited: "",
        pdfUrl: "",
        point: "",
        score: ""
      },
      tableData: []
    };
  },
  methods: {
    async uploadAdditionSuccess(response) {
      console.log("this.form:::", this.form);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.form.files = JSON.stringify(this.additionFiles);
          await axios.$post("/teacherPaper/update", this.form);
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
        this.form.files = JSON.stringify(this.additionFiles);
        await axios.$post("/teacherPaper/update", this.form);
      }
    },
    handleClick(row) {
      console.log(row);
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async changeFlag(row) {
      row.pick = !row.pick;
    },
    downLoadFile(rows) {
      if (rows.pdfUrl) {
        window.open(rows.pdfUrl);
      } else {
        this.$message({
          type: "info",
          message: "该条记录无附件"
        });
      }
    },
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
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
      let res = await axios.$post("/teacherPaper/list", this.query);
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
        await axios.$post("/teacherPaper/update", this.examineForm);
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
      if (this.form.files) this.form.files = JSON.stringify(this.additionFiles);
      switch (this.operate) {
        case "add":
          await axios.$post("/teacherPaper/add", this.form);
          break;
        case "edit":
          await axios.$post("/teacherPaper/update", this.form);
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
        this.form = {
          year: "",
          teacherId: "",
          name: "",
          entrance: "",
          studentAuthor: "",
          studentType: "",
          studentGrade: "",
          studentMajor: "",
          authorCnt: "",
          tutorIndex: "",
          studentIndex: "",
          author: "",
          title: "",
          journal: "",
          titleDate: "",
          publishInfo: "",
          pageRange: "",
          origin: "",
          esi: "",
          level: "",
          issn: "",
          impactFactor: "",
          timesCited: "",
          pdfUrl: "",
          point: "",
          score: ""
        };
        this.additionFiles = [];
      } else {
        row.esi = row.esi.toString();
        if (row.pdfUrl) this.additionFiles = JSON.parse(row.pdfUrl);
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
        data = await axios.$download("/teacherPaper/export?id=-1", {});
      } else {
        data = await axios.$download("/teacherPaper/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-lxsxx.xls");
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
            await axios.$post("/teacherPaper/delete", {
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
          await axios.$post("/teacherPaper/delete", {
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