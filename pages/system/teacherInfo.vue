<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="姓名:">
          <el-input clearable id="nameBox" v-model="query.name" size="normal" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门:">
          <el-select v-model="query.deptName" size="normal">
            <el-option
              v-for="item in names"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="query.statusName" size="normal">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
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
              <!-- <el-dropdown-item command="temp">模板下载</el-dropdown-item> -->
              <!-- <el-dropdown-item command="download">导出数据</el-dropdown-item> -->
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="freeze">冻结用户</el-dropdown-item>
              <el-dropdown-item command="unfreeze">解除冻结</el-dropdown-item>
              <el-dropdown-item command="distribution">分配角色</el-dropdown-item>
              <el-dropdown-item command="reset">重置密码</el-dropdown-item>
              <!-- <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
:file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
                >
                  <el-button class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" prop="pick" label align="center" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="id"
        align="center"
        label="ID"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="account"
        align="center"
        label="工号/账号"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="name"
        align="center"
        label="姓名"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="department"
        align="center"
        label="所在系"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sexName" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="age" align="center" label="年龄"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="nation" align="center" label="民族"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="最高学历"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="politic" align="center" label="政治面貌"></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="work_date"
        align="center"
        label="参加工作年月"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="school_date"
        align="center"
        label="进校年月"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="state" align="center" label="状态"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="post" align="center" label="岗位"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="title" align="center" label="现职称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level" align="center" label="现职级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tutor_state" align="center" label="导师资格"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="job" align="center" label="现职务"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="highest_education"
        align="center"
        label="最高学历"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="highest_degree"
        align="center"
        label="最高学位"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="school" align="center" label="毕业学校"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="毕业专业"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="graduation_date"
        align="center"
        label="毕业年月"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tutor" align="center" label="导师"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="subject_category"
        align="center"
        label="学科类别"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="research_direction"
        align="center"
        label="研究方向"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="talent_category"
        align="center"
        label="人才类别"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="overseas_experience"
        align="center"
        label="海外研修经历"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="national_award"
        align="center"
        label="国家级奖项"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="provincial_award"
        align="center"
        label="省级奖项"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="类型"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="double_teacher"
        align="center"
        label="是否双师型"
      >
        <template slot-scope="scope">
          <span>{{scope.row.double_teacher | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="engineering_background"
        align="center"
        label="是否工程背景"
      >
        <template slot-scope="scope">
          <span>{{scope.row.engineering_background | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="industry_background"
        align="center"
        label="是否行业背景"
      >
        <template slot-scope="scope">
          <span>{{scope.row.industry_background | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="移动电话"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="statusName" align="center" label="状态"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
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
    <!-- 学时查看窗口 -->
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
      <el-divider content-position="left">账号信息</el-divider>
      <el-form :disabled="!['edit', 'add'].includes(operate)" :model="form" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号/账号" prop="account">
              <el-input learable v-model="form.account" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" learable placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" learable placeholder style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在系" prop="department">
              <el-select
                v-model="form.department"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="无" value="无"></el-option>
                <el-option label="管理科学与信息管理系" value="管理科学与信息管理系"></el-option>
                <el-option label="企业管理系" value="企业管理系"></el-option>
                <el-option label="金融学系" value="金融学系"></el-option>
                <el-option label="财务与投资管理系" value="财务与投资管理系"></el-option>
                <el-option label="经济与贸易系" value="经济与贸易系"></el-option>
                <el-option label="会计学系" value="会计学系"></el-option>
                <el-option label="市场营销系" value="市场营销系"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item v-if="['add'].includes(operate)" label="密码">
              <el-input v-model="form.password" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="['add'].includes(operate)" label="再次输入密码">
              <el-input v-model="form.rePassword" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleid" placeholder="请选择权限" style="width:99%">
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select v-model="form.deptid" placeholder="请选择部门" style="width:99%">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.simplename"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">基本信息</el-divider>
        <!-- <el-row>
        <el-col :span="12">-->
        <el-form-item label="身份证号码" prop="id_num">
          <el-input v-model="form.idNum" style="width:99%"></el-input>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="12">
            <el-form-item label="年龄">
              <el-input v-model="form.rePassword" style="width:99%"></el-input>
            </el-form-item>
        </el-col>-->
        <!-- </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input v-model="form.nation" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politic">
              <el-input v-model="form.politic" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参加工作年月" prop="workDate">
              <el-date-picker
                v-model="form.workDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进校年月" prop="schoolDate">
              <el-date-picker
                v-model="form.schoolDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-select v-model="query.state" size="normal" style="width:99%" placeholder="请选择">
                <el-option label="在职" value="在职"></el-option>
                <el-option label="离职" value="离职"></el-option>
                <el-option label="调离" value="调离"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="post">
              <el-input v-model="form.post" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现职称" prop="title">
              <el-input v-model="form.title" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获得现职称年月" prop="titleDate">
              <el-date-picker
                v-model="form.titleDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现职级" prop="level">
              <el-input v-model="form.level" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导师资格" prop="tutorState">
              <el-input v-model="form.tutorState" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现职务" prop="job">
              <el-input v-model="form.job" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="highestEducation">
              <el-input v-model="form.highestEducation" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学位" prop="highestDegree">
              <el-input v-model="form.highestDegree" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业学校" prop="school">
              <el-input v-model="form.school" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="毕业年月" prop="graduationDate">
              <el-date-picker
                v-model="form.graduationDate"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期时间"
                style="width: 98%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业专业" prop="major">
              <el-input v-model="form.major" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="导师" prop="tutor">
              <el-input v-model="form.tutor" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="query.type" size="normal" style="width:99%" placeholder="请选择">
                <el-option label="教学部门" value="教学部门"></el-option>
                <el-option label="行政部门" value="行政部门"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学科类别" prop="subjectCategory">
              <el-input v-model="form.subjectCategory" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人才类别" prop="talentCategory">
              <el-input v-model="form.talentCategory" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="研究方向" prop="researchDirection">
          <el-input type="textarea" v-model="form.researchDirection" style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="海外研修经历" porp="overseasExperience">
          <el-input type="textarea" v-model="form.overseasExperience" style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="国家级奖项" prop="nationalAward">
          <el-input type="textarea" v-model="form.nationalAward" style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="省级奖项" prop="provincialAward">
          <el-input type="textarea" v-model="form.provincialAward" style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否工程背景" prop="engineeringBackground">
              <el-select
                v-model="form.engineeringBackground"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否行业背景" prop="industryBackground">
              <el-select
                v-model="form.industryBackground"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否双师型" prop="doubleTeacher">
              <el-select
                v-model="form.doubleTeacher"
                size="normal"
                placeholder="请选择"
                style="width:99%"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="移动电话" prop="phone">
              <el-input v-model="form.phone" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" clearable v-model="form.remark" placeholder style="width:99%"></el-input>
        </el-form-item>
      </el-form>
      <!-- <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="dialogFormVisible = false" size="normal">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="normal">确定</el-button>
        <el-button v-if="['add'].includes(operate)" size="normal" @click="resetForm('form')">重置</el-button>
      </div>-->
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
      pick: false,
      loading: true,
      total: 0,
      page: 1,
      operate: "",
      header: {},
      formDisabled: false,
      dialogFormVisible: false,
      fileList: [],
      query: {
        limit: 12,
        offset: 0,
        order: "desc",
        deptid: 0,
        name: "",
        beginTime: "",
        endTime: ""
      },
      examineDialog: false,
      form: {
        account: "",
        statusName: "1",
        id: "",
        deptid: ""
      },
      examineForm: {
        roleIds: "7"
      },
      admin: false,
      names: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "27",
          label: "战略部"
        },
        {
          value: "32",
          label: "会计学系"
        },
        {
          value: "25",
          label: "开发部"
        }
      ],
      roles: [],
      statuses: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "2",
          label: "禁用"
        }
      ],
      departments: [],
      tableData: []
    };
  },
  filters: {
    statusFilter: function(value) {
      if (value) {
        return {
          "0": "管理员",
          "1": "超级管理员",
          "19": "部门管理员",
          "7": "教师",
          "21": "科研学科办公室管理员"
        }[value.toString()];
      }
    },
    flagFilter: function(value) {
      if (value != undefined) {
        return {
          false: "否",
          true: "是"
        }[value.toString()];
      }
    },
    teacherFilter: async function(value) {
      let teacherList = await axios.$get("/mgr/quicklist", { params: "" });
      let temp = {};
      for (let i = 0; i < teacherList.length; i++) {
        const element = teacherList[i];
        temp[element.id + ""] = element.name;
      }
      return temp[value.toString()];
    }
  },

  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    changeFlag(row) {
      console.log("changePick");
      row.pick = !row.pick;
    },
    async list() {
      this.loading = true;
      this.pick = false;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let res = await axios.$post("/mgr/list", this.query);
      let now = moment(new Date());
      console.log(res);
      for (let i = 0; i < res.rows.length; i++) {
        let element = res.rows[i];
        if (element.graduation_date) {
          element.graduation_date = moment(element.graduation_date).format(
            "YYYY-MM"
          );
        }
        if (element.work_date) {
          element.work_date = moment(element.work_date).format("YYYY-MM");
        }
        if (element.school_date) {
          element.school_date = moment(element.school_date).format("YYYY-MM");
        }
      }
      this.tableData = res.rows;
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        if (element.roleid == "1") {
          this.admin = false;
        } else {
          this.admin = true;
        }
        element.age = now.diff(element.birthday, "years");
      }
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async submitForm(formName) {
      switch (this.operate) {
        case "add":
          this.form.password = this.form.account;
          this.form.rePassword = this.form.account;
          await axios.$post("/mgr/add", this.form);
          break;
        case "edit":
          await axios.$post("/mgr/edit", this.form);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    async handleCommand(command) {
      console.log(command);
      let userList = [];
      switch (command) {
        case "download":
          this.exportData(command);
          break;
        case "delCount":
          this.delCount();
          break;
        case "temp":
          location.href = "http://bsoa.csu.edu.cn/excel-model/gzl-ktjx.xls";
          break;
        case "freeze":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element.pick, "freeze");
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将冻结所有选中账号, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/freeze", { userId: element.id });
            }
            this.tableData = [];
            await this.list();
          });
          break;
        case "unfreeze":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element.pick, "unfreeze");
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将解冻所有冻结账号, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/unfreeze", { userId: element.id });
            }
            this.tableData = [];
            await this.list();
          });
          break;
        case "distribution":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;
        case "reset":
          userList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            if (element.pick) {
              userList.push(element);
            }
          }
          if (userList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.$confirm("此操作将重置选中账号秘密, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            for (let i = 0; i < userList.length; i++) {
              const element = userList[i];
              await axios.$get("/mgr/reset", { userId: element.id });
            }
            this.$message({
              type: "success",
              message: "重置成功，新密码为111111"
            });
            this.tableData = [];
            await this.list();
            //      async setTimeout(() => {
            //           this.tableData = [];
            // await this.list();
            //       }, 1000);
          });

          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/mgr/export", {
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
    async delCount() {
      let deleteList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          deleteList.push(element);
        }
      }

      if (deleteList.length == 0) {
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
            let userId = element.id;
            await axios.$post("/mgr/delete", {
              userId: userId
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
      let userList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        if (element.pick) {
          userList.push(element);
        }
      }
      if (userList.length <= 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      for (let i = 0; i < userList.length; i++) {
        const element = userList[i];
        await axios.$get("/mgr/setRole", {
          userId: element.id,
          roleIds: this.examineForm.roleIds
        });
      }
      this.$message({
        type: "success",
        message: "角色配置成功!"
      });
      this.tableData = [];
      this.list();
      this.examineDialog = false;
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.form = {
          account: "",
          id: "",
          deptid: "",
          birthday: "",
          avatar: "",
          password: "",
          rePassword: ""
        };
      } else {
        // this.form = row;
        this.form = {
          account: row.account,
          id: row.id,
          deptid: row.deptid.toString(),
          birthday: row.birthday,
          avatar: row.avatar,
          email: row.email,
          phone: row.phone,
          name: row.name,
          roleid: row.roleid.toString(),
          password: "",
          rePassword: "",
          department: row.department,
          graduationDate: row.graduation_date,
          highestDegree: row.highest_degree,
          highestEducation: row.highest_education,
          // industryBackground: row.industry_background.toString(),
          // engineeringBackground: row.engineering_background.toString(),
          // doubleTeacher: row.double_teacher.toString(),
          idNum: row.id_num,
          job: row.job,
          level: row.level,
          major: row.major,
          nation: row.nation,
          nationalAward: row.national_award,
          politic: row.politic,
          post: row.post,
          provincialAward: row.provincial_award,
          overseasExperience: row.overseas_experience,
          remark: row.remark,
          researchDirection: row.research_direction,
          school: row.school,
          schoolDate: row.school_date,
          // sex: row.sex.toString(),
          state: row.state,
          subjectCategory: row.subject_category,
          talentCategory: row.talent_category,
          title: row.title,
          titleDate: row.title_date,
          tutor: row.tutor,
          tutorState: row.tutor_state,
          workDate: row.work_date
        };
        // industryBackground: row.industry_background.toString(),
        // engineeringBackground: row.engineering_background.toString(),
        // doubleTeacher: row.double_teacher.toString(),
        if (row.sex) this.form.sex = row.sex.toString();
        if (row.engineeringBackground)
          this.form.engineeringBackground = row.engineeringBackground.toString();
        if (row.industryBackground)
          this.form.industryBackground = row.industryBackground.toString();
        if (row.doubleTeacher)
          this.form.doubleTeacher = row.doubleTeacher.toString();
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
          let userId = row.id;
          await axios.$post("/mgr/delete", {
            userId: userId
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
    async init() {
      // 初始化权限下拉
      this.roles = await axios.$post("/role/list");
      // 初始化部门
      this.departments = await axios.$get("/dept/list", {
        params: {
          limit: 1000,
          offset: 0,
          order: "desc",
          condition: ""
        }
      });
      this.roles.filter(function(value) {
        value.id = value.id.toString();
        return value;
      });
      this.departments.filter(function(value) {
        value.id = value.id.toString();
        return value;
      });
      console.log("this.departments::", this.departments);
    }
  },
  mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    this.init();
    this.list();
  }
};
</script>

<style>
.search-form {
  margin-bottom: 10px;
}
.el-input.is-disabled .el-input__inner {
  color: #606266;
}
#nameBox {
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