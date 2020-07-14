<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课程名称:">
          <el-input id="nameBox" v-model="query.name" placeholder="请输入班级" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="授课类别" prop="type">
          <el-select v-model="query.type" size="normal" placeholder="请选择授课类别">
            <el-option label="本科生" value="本科生"></el-option>
            <el-option label="博士生" value="博士生"></el-option>
            <el-option label="MBA、工程硕士" value="MBA、工程硕士"></el-option>
            <el-option label="非全日制会计专硕" value="非全日制会计专硕"></el-option>
            <el-option label="统招硕士、会计硕士、金融硕士" value="统招硕士、会计硕士、金融硕士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全英文" prop="type">
          <el-select v-model="query.english" size="normal" placeholder="请选择状态">
            <el-option label="全部" value></el-option>
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="授课对象:">
          <el-select v-model="query.target" size="normal" placeholder="请输选择授课对象">
            <el-option label="全部" value></el-option>
            <el-option label="本科生" value="本科生"></el-option>
            <el-option label="研究生" value="研究生"></el-option>
            <el-option label="博士生" value="博士生"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="教师:" :v-if="role">
          <el-select size="normal" v-model="query.teacher" filterable placeholder="请选择老师">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              filterable
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="query.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
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
          <el-dropdown v-if="showFunctionList" @command="handleCommand" style="float:right;">
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
                  action="http://bs.hk.darkal.cn/teaching/upload?token='AuthenticationToken'"
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
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="课程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="teacher" align="center" label="教师"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="类型"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="courseType1"
        align="center"
        label="课程类型1"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="courseType2"
        align="center"
        label="课程类型2"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="score" align="center" label="学分"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="totalHours" align="center" label="总学时"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="theoryHours" align="center" label="理论学时"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="examHours" align="center" label="实验学时"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="computerHours"
        align="center"
        label="上机学时"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="practiceHours"
        align="center"
        label="实践学时"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="examWeek" align="center" label="集中实验周"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="classCnt" align="center" label="班级数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="className" align="center" label="班级名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="choiceCnt" align="center" label="选课人数"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="teachingUnit"
        align="center"
        label="承担单位"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="excellentCourse"
        align="center"
        label="精品示范课程"
      >
        <template slot-scope="scope">
          <span>{{scope.row.excellentCourse | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tagType" align="center" label="标签类别"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="statistics"
        align="center"
        label="是否参与部门统计"
      >
        <template slot-scope="scope">
          <span>{{scope.row.statistics | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="material" align="center" label="使用教材"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="materialType"
        align="center"
        label="教材类型"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="english" align="center" label="是否为全英文授课">
        <template slot-scope="scope">
          <span>{{scope.row.english | flagFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="target" align="center" label="授课对象"></el-table-column> -->
      <!-- <el-table-column :show-overflow-tooltip="true" prop="teacher" align="center" label="教师"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="hours" align="center" label="实际课时"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="count" align="center" label="授课人数"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="editorName" align="center" label="录入人"></el-table-column>
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
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        layout="prev, pager, next"
        :total="this.total"
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
        label-width="170px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-date-picker
                size="normal"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
                style="width:99%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="name">
              <el-autocomplete
                clearable
                v-model="ruleForm.name"
                :fetch-suggestions="queryCourse"
                placeholder="请输入内容"
                style="width:99%"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否为全英文" prop="english">
              <el-select v-model="ruleForm.english" placeholder="请选择" style="width:99%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课类别" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择授课类别" style="width:99%">
                <!-- <el-option label="本科教学" value="本科教学"></el-option>
                <el-option label="研管安排" value="研管安排"></el-option>
                <el-option label="MBA安排" value="MBA安排"></el-option>
                <el-option label="专业硕士安排" value="专业硕士安排"></el-option>
                <el-option label="EMBA、EDP其他" value="EMBA、EDP其他"></el-option>
                <el-option label="本科文化素质课" value="本科文化素质课"></el-option>-->
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="博士生" value="博士生"></el-option>
                <el-option label="MBA、工程硕士" value="MBA、工程硕士"></el-option>
                <el-option label="非全日制会计专硕" value="非全日制会计专硕"></el-option>
                <el-option label="统招硕士、会计硕士、金融硕士" value="统招硕士、会计硕士、金融硕士"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="授课对象" prop="target">
              <el-select
                v-model="ruleForm.target"
                size="normal"
                style="width:99%"
                placeholder="请输选择授课对象"
              >
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="研究生" value="研究生"></el-option>
                <el-option label="博士生" value="博士生"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程类型1" prop="courseType1">
              <el-select v-model="ruleForm.courseType1" placeholder="请选择授课类别" style="width:99%">
                <el-option label="任选" value="任选"></el-option>
                <el-option label="必修" value="必修"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型2" prop="courseType2">
              <!-- <el-select
                v-model="ruleForm.courseType2"
                size="normal"
                style="width:99%"
                placeholder="请输选择授课对象"
              >
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="研究生" value="研究生"></el-option>
                <el-option label="博士生" value="博士生"></el-option>
              </el-select>-->
              <el-input v-model="ruleForm.courseType2" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学分" prop="score">
              <el-input v-model="ruleForm.score" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总学时" prop="totalHours">
              <el-input v-model="ruleForm.totalHours" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="理论学时" prop="theoryHours">
              <el-input v-model="ruleForm.theoryHours" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实验学时" prop="examHours">
              <el-input v-model="ruleForm.examHours" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上机学时" prop="computerHours">
              <el-input v-model="ruleForm.computerHours" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践学时" prop="practiceHours">
              <el-input v-model="ruleForm.practiceHours" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="集中实验周" prop="examWeek">
              <el-input v-model="ruleForm.examWeek" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级数" prop="classCnt">
              <el-input v-model="ruleForm.classCnt" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="ruleForm.className" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选课人数" prop="choiceCnt">
              <el-input v-model="ruleForm.choiceCnt" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承担单位" prop="teachingUnit">
              <el-input v-model="ruleForm.teachingUnit" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精品示范课程" prop="excellentCourse">
              <!-- <el-input v-model="ruleForm.excellentCourse" style="width:99%"></el-input> -->
              <el-select v-model="ruleForm.excellentCourse" placeholder="请选择授课类别" style="width:99%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签类别" prop="tagType">
              <!-- <el-select
                v-model="ruleForm.tagType"
                size="normal"
                placeholder="请输选择授课对象"
                style="width:99%"
              >
                <el-option label="本科生" value="本科生"></el-option>
                <el-option label="研究生" value="研究生"></el-option>
                <el-option label="博士生" value="博士生"></el-option>
              </el-select>-->
              <el-input v-model="ruleForm.tagType" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否参与部门统计" prop="statistics">
              <el-select v-model="ruleForm.statistics" placeholder="请选择授课类别" style="width:99%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="使用教材" prop="material">
              <el-input v-model="ruleForm.material" style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教材类型" prop="materialType">
              <el-input v-model="ruleForm.materialType" style="width:98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际课时" prop="hours" style="width:99%">
              <el-input
                v-model="ruleForm.hours"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际人数" prop="count" style="width:99%">
              <el-input
                v-model="ruleForm.count"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教师" prop="teacher" v-if="showTeachInput">
              <el-select
                v-model="ruleForm.teacher"
                filterable
                placeholder="请选择老师"
                　style="width:99%"
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  filterable
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select
            v-model="ruleForm.auditFlag"
            size="normal"
            placeholder="请选择状态"
            style="width:99%"
          >
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
      showFunctionList: false,
      pick: false,
      examineDialog: false,
      total: 0,
      dialogFormVisible: false,
      formDisabled: false,
      loading: false,
      showTeachInput: false,
      courseNames: [],
      yearsOptions: [],
      page: 1,
      query: {
        limit: 10,
        offset: 0,
        order: "desc",
        condition: ""
      },
      teacherList: [],
      header: {},
      fileList: [],
      role: false,
      operate: "",
      ruleForm: {
        year: "2019",
        name: "",
        type: "0",
        target: "",
        hours: 0,
        count: 0,
        auditFlag: "0",
        english: "",
        desc: ""
      },
      checkedList: [],
      examineForm: {
        auditFlag: "0"
      },
      tableData: [],
      roleId: 0,
      rules: {
        name: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
          // { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        // type: [
        //   { required: true, message: "请选择授课类型", trigger: "change" }
        // ],
        // target: [
        //   { required: true, message: "请输入授课对象", trigger: "blur" }
        // ],
        hours: [
          { required: true, message: "请输入课时", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        // count: [
        //   { required: true, message: "请输入人数", trigger: "blur" },
        //   { validator: validateNumber, trigger: "blur" }
        // ],
        teacher: [{ required: true, message: "请输入教师", trigger: "blur" }]
      }
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已审核",
        "2": "未通过"
      }[value.toString()];
    },
    flagFilter: function(value) {
      if (value != undefined) {
        return {
          true: "是",
          false: "否"
        }[value.toString()];
      }
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log("handleSelectionChange:::", val);
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      this.loading = true;
      this.tableData = [];
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      let userInfo = localStorage.getItem("userInfo");
      if (!user.includes(888) && userInfo.roleid != 19) {
        this.query.editor = localStorage.getItem("userId");
        this.role = false;
      } else if (userInfo.roleid == 19) {
      } else {
        this.role = true;
      }
      console.log(this.role, "============role");
      let query = this.query;
      // for (let i = 0; i < this.teacherList.length; i++) {
      //   const element = this.teacherList[i];
      //   console.log(element.name);
      //   if (element.name === query.teacher) {
      //     query.teacher = element.id;
      //   }
      // }
      let res = await axios.$post("/teaching/list", query);
      this.tableData = res.rows;
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        for (let j = 0; j < this.teacherList.length; j++) {
          const teacher = this.teacherList[j];
          if (element.teacher == teacher.id) {
            element.teacher = teacher.name;
          }
        }
      }
      this.total = res.total;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/teaching/export?id=-1", {});
      } else {
        data = await axios.$download("/teaching/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作量-课堂教学.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.hours = parseInt(this.ruleForm.hours);
          this.ruleForm.auditFlag = parseInt(this.ruleForm.auditFlag);
          console.log(this.ruleForm);
          // el-autocomplete
          this.updateCourseNames();
          // axios调用
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      switch (this.operate) {
        case "add":
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id;
            }
          }
          let verification = false;
          this.$refs[formName].validate(valid => {
            if (valid) {
              verification = true;
              console.log("success");
              return true;
            } else {
              verification = false;
              this.ruleForm.persons = "";
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
          if (this.roleId == 1 || this.roleId == 19) {
            this.ruleForm.auditFlag = 1;
          }
          await axios.$post("/teaching/add", this.ruleForm);
          break;
        case "edit":
          for (let i = 0; i < this.teacherList.length; i++) {
            const element = this.teacherList[i];
            if (this.ruleForm.teacher == element.name) {
              this.ruleForm.teacher = element.id.toString();
            }
          }
          await axios.$post("/teaching/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;

      await this.list();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    queryCourse(queryString, cb) {
      var courseNames = this.courseNames;
      var results = queryString
        ? courseNames.filter(this.createFilter(queryString))
        : courseNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return name => {
        return (
          name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    loadCourseNames() {
      return [
        { value: "高等数学" },
        { value: "离散数学" },
        { value: "线性代数" },
        { value: "数据结构" },
        { value: "微机原理" },
        { value: "网络安全" },
        { value: "数字图像处理" },
        { value: "大学物理" }
      ];
    },
    updateCourseNames() {
      this.courseNames.push({
        value: this.ruleForm.name
      });
      // 去重
      this.courseNames = _.uniqWith(this.courseNames, _.isEqual);
      // 存本地
      localStorage.setItem("courseNames", JSON.stringify(this.courseNames));
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          year: "",
          name: "",
          type: "",
          target: "",
          hours: 0,
          count: 0,
          auditFlag: "0",
          english: "",
          teacher: "",
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        if (this.roles.indexOf(888) == -1) {
          this.ruleForm.teacher = localStorage.getItem("userId");
        }
      } else {
        this.ruleForm = row;
        this.ruleForm.excellentCourse = this.ruleForm.excellentCourse.toString();
        this.ruleForm.statistics = this.ruleForm.statistics.toString();
        this.ruleForm.english = this.ruleForm.english.toString();
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
          let teachingId = row.id;
          await axios.$post("/teaching/delete", {
            teachingId: teachingId
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
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    createFilter(queryString) {
      return teacher => {
        return (
          teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
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
            await axios.$post("/teaching/delete", {
              teachingId: vm.checkedList[i].id
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
        await axios.$post("/teaching/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
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
    }
  },
  async mounted() {
    this.checkCanUse();
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 2010; i--) {
      this.yearsOptions.push({
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
    await this.list();

    this.courseNames = localStorage.getItem("courseNames")
      ? JSON.parse(localStorage.getItem("courseNames"))
      : [];
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>
<style scoped>
.el-autocomplete {
  width: 100%;
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