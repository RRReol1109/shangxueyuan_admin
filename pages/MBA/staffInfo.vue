<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="教职工号:">
          <el-input v-model="query.id" placeholder="请输入工号" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="教职工姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="籍贯:">
          <el-input v-model="query.teacher" placeholder="请输入籍贯" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="来院工作年月:">
          <el-date-picker
            v-model="query.createtime"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期时间"
            size="normal"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="现任职务年月:">
          <el-date-picker
            v-model="query.createtime"
            type="date"
            format="yyyy-MM"
            value-format="yyyy-MM"
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
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/teacherInfo/upload?token='AuthenticationToken'"
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
      <!-- <el-table-column fixed prop="year" align="center" label="教职工工号"></el-table-column> -->
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="教职工姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="college" align="center" label="所在系"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="nativePlace" align="center" label="籍贯"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="nation" align="center" label="民族"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="political" align="center" label="政治面貌"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="idNum" align="center" label="身份证号码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startDate" align="center" label="来院工作年月"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="address" align="center" label="现住址"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="state" align="center" label="状态"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="editorDeptName"
        align="center"
        label="岗位"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="title" align="center" label="现职称"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="titleDate"
        align="center"
        label="获得现职称年月"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level" align="center" label="现职级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tutor" align="center" label="导师资格"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="personType" align="center" label="人才类别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="post" align="center" label="现职务"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="postDate" align="center" label="任现职务年月"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="highEducation"
        align="center"
        label="最高学历"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="highDegree" align="center" label="最高学位"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="school" align="center" label="毕业学校"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="college" align="center" label="毕业专业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startDate" align="center" label="毕业年月"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="qq" align="center" label="QQ"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="联系电话"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="homePhone" align="center" label="家庭电话"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="email" align="center" label="电子邮箱"></el-table-column>
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
    <el-dialog size="60%" style="min-height:500px" title :visible.sync="examineDialog">
      <el-form
        :model="examineForm"
        :rules="rules"
        ref="examineForm"
        label-width="100px"
        class="demo-examineForm"
      >
        <el-row>
          <el-form-item>
            <el-form-item label="审核状态:" v-if="role">
              <el-select
                v-model="examineForm.auditFlag"
                style="width:99%;"
                size="normal"
                placeholder="请选择状态"
              >
                <el-option label="未审核" value="0"></el-option>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="examineDialog = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="examineData('examineForm')" size="normal">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
      size="60%"
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
        label-width="150px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="教职工姓名" prop="name">
              <el-input size="normal" v-model="form.name" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在系" prop="college">
              <el-select v-model="form.gender" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="企管系" value="男"></el-option>
                <el-option label="营销系" value="营销系"></el-option>
                <el-option label="信息系" value="信息系"></el-option>
                <el-option label="金融系" value="金融系"></el-option>
                <el-option label="财管系" value="财管系"></el-option>
                <el-option label="经贸系" value="经贸系"></el-option>
                <el-option label="会计系" value="会计系"></el-option>
                <el-option label="行政" value="行政"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input size="normal" v-model="form.nativePlace" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input size="normal" v-model="form.nation" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="political">
              <el-select v-model="form.political" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="共产党员" value="共产党员"></el-option>
                <el-option label="民主党派" value="民主党派"></el-option>
                <el-option label="无党派" value="无党派"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idNum">
              <el-input size="normal" v-model="form.idNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来院工作年月:" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                style="width:99%"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现住址" prop="address">
              <el-input size="normal" v-model="form.address" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-select v-model="form.state" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="在职" value="在职"></el-option>
                <el-option label="退休" value="退休"></el-option>
                <el-option label="调走" value="调走"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位" prop="editorDeptName">
              <el-select
                v-model="form.editorDeptName"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="教学科研" value="教学科研"></el-option>
                <el-option label="教学" value="教学"></el-option>
                <el-option label="科研" value="科研"></el-option>
                <el-option label="开发" value="开发"></el-option>
                <el-option label="行政" value="行政"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现职称" prop="title">
              <el-select v-model="form.title" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="教授" value="教授"></el-option>
                <el-option label="副教授" value="副教授"></el-option>
                <el-option label="讲师" value="讲师"></el-option>
                <el-option label="助教" value="助教"></el-option>
                <el-option label="研究员" value="研究员"></el-option>
                <el-option label="副研究员" value="副研究员"></el-option>
                <el-option label="高级工程师" value="高级工程师"></el-option>
                <el-option label="工程师" value="工程师"></el-option>
                <el-option label="高级实验师" value="高级实验师"></el-option>
                <el-option label="实验师" value="实验师"></el-option>
                <el-option label="图书馆员" value="图书馆员"></el-option>
                <el-option label="会计师" value="会计师"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="获得现职称年月:" prop="titleDate">
              <el-date-picker
                v-model="form.titleDate"
                style="width:99%"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现职级" prop="level">
              <el-select v-model="form.level" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="教授一级" value="教授一级"></el-option>
                <el-option label="教授二级" value="教授二级"></el-option>
                <el-option label="教授三级" value="教授三级"></el-option>
                <el-option label="教授四级" value="教授四级"></el-option>
                <el-option label="副教授一级" value="副教授一级"></el-option>
                <el-option label="副教授二级" value="副教授二级"></el-option>
                <el-option label="副教授三级" value="副教授三级"></el-option>
                <el-option label="讲师一级" value="讲师一级"></el-option>
                <el-option label="讲师二级" value="讲师二级"></el-option>
                <el-option label="讲师三级" value="讲师三级"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="导师资格" prop="tutor">
              <el-select v-model="form.tutor" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="博导" value="博导"></el-option>
                <el-option label="硕导" value="硕导"></el-option>
                <el-option label="本导" value="本导"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人才类别" prop="personType">
              <el-select
                v-model="form.personType"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="国务院政府特殊津贴专家" value="国务院政府特殊津贴专家"></el-option>
                <el-option label="长江学者" value="长江学者"></el-option>
                <el-option label="教育部新世纪人才" value="教育部新世纪人才"></el-option>
                <el-option label="中南大学531第一层次人才" value="中南大学531第一层次人才"></el-option>
                <el-option label="中南大学531第二层次人才" value="中南大学531第二层次人才"></el-option>
                <el-option label="中南大学531第三层次人才" value="中南大学531第三层次人才"></el-option>
                <el-option label="青年骨干教师" value="青年骨干教师"></el-option>
                <el-option label="升华猎英" value="升华猎英"></el-option>
                <el-option label="升华育英" value="升华育英"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现职务" prop="post">
              <el-input size="normal" v-model="form.post" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任现职务年月:" prop="postDate">
              <el-date-picker
                v-model="form.postDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width:99%"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="highEducation">
              <el-select
                v-model="form.highEducation"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="博士研究生" value="博士研究生"></el-option>
                <el-option label="硕士研究生" value="硕士研究生"></el-option>
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="专科生" value="专科生"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学位" prop="highDegree">
              <el-select
                v-model="form.highDegree"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="博士" value="博导"></el-option>
                <el-option label="硕士" value="硕导"></el-option>
                <el-option label="学士" value="本导"></el-option>
                <el-option label="无" value="无"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="毕业学校" prop="school">
              <el-input size="normal" v-model="form.school" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业专业" prop="college">
              <el-input size="normal" v-model="form.college" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="毕业年月" prop="graduateDate">
              <el-date-picker
                v-model="form.graduateDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width:99%"
                size="normal"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭电话" prop="homePhone">
              <el-input size="normal" v-model="form.homePhone" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="移动电话" prop="phone">
              <el-input size="normal" v-model="form.phone" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input size="normal" v-model="form.email" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ号" prop="qq">
              <el-input size="normal" v-model="form.qq" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态" style="width:99%">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
          </el-select>
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
    return {
      operate: "",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      fileList: [],
      query: {
        limit: 14,
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
      form: {
        college: "",
        gender: "",
        nativePlace: "",
        nation: "",
        political: "",
        idNum: "",
        startDate: "",
        address: "",
        state: "",
        editorDeptName: "",
        title: "",
        titleDate: "",
        level: "",
        tutor: "",
        personType: "",
        postDate: "",
        highEducation: "",
        highDegree: "",
        school: "",
        college: "",
        startDate: "",
        qq: "",
        phone: "",
        homePhone: "",
        email: ""
      },
      tableData: []
    };
  },
  methods: {
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
      let res = await axios.$post("/teacherInfo/list", this.query);
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
        await axios.$post("/teacherInfo/update", this.examineForm);
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
          await axios.$post("/teacherInfo/add", this.form);
          break;
        case "edit":
          await axios.$post("/teacherInfo/update", this.form);
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
          college: "",
          gender: "",
          nativePlace: "",
          nation: "",
          political: "",
          idNum: "",
          startDate: "",
          address: "",
          state: "",
          editorDeptName: "",
          title: "",
          titleDate: "",
          level: "",
          tutor: "",
          personType: "",
          postDate: "",
          highEducation: "",
          highDegree: "",
          school: "",
          college: "",
          startDate: "",
          qq: "",
          phone: "",
          homePhone: "",
          email: ""
        };
      } else {
        row.auditFlag = row.auditFlag.toString();
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
        data = await axios.$download("/teacherInfo/export?id=-1", {});
      } else {
        data = await axios.$download("/teacherInfo/export", {
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
            await axios.$post("/teacherInfo/delete", {
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
          await axios.$post("/teacherInfo/delete", {
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