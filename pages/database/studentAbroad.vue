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
            size="normal"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="拟留学身份:">
          <el-select v-model="query.studyPlan" size="normal" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="硕博连读" value="硕博连读"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习期限:" size="normal">
          <el-date-picker
            v-model="query.studyTime"
            type="date"
            format="yyyy-MM"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label v-if="deptid==32||roleId==1">
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item v-if="deptid==32||roleId==1">
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
                  action="http://bs.hk.darkal.cn/abroad/upload?token='AuthenticationToken'"
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
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="手机"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="identity" align="center" label="身份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studyPlan" align="center" label="留学身份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="profession" align="center" label="专业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="undergraduateSchool" align="center" label="本科学校"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studySchool" align="center" label="学习学校"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startTime" align="center" label="开始时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="endTime" align="center" label="结束时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="learningWay" align="center" label="学习形式"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="applicationStatus" align="center" label="申请状态"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>-->
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="学生姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studentId" align="center" label="学号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="degree" align="center" label="在读学位类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="profession" align="center" label="专业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="internalTutor"
        align="center"
        label="国内导师"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studyPlan" align="center" label="拟留学身份"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="studySchool"
        align="center"
        label="留学单位（英文）"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="overseasTutor"
        align="center"
        label="海外导师"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="studyTime" align="center" label="学习期限"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="fundingType" align="center" label="资助类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="手机号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="150"
        v-if="deptid==32||roleId==1"
      >
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
    <el-drawer size="60%" style="min-height:500px" title="出国学生" :visible.sync="dialogFormVisible">
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
            <el-form-item label="在读学位类型" prop="degree">
              <el-select v-model="form.degree" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="本科" value="本科"></el-option>
                <el-option label="硕士" value="硕士"></el-option>
                <el-option label="博士" value="博士"></el-option>
                <el-option label="硕博连读" value="硕博连读"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <el-input size="normal" v-model="form.studentId" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input size="normal" v-model="form.name" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" size="normal" placeholder="请选择" style="width:99%">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                size="normal"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="form.birthday"
                style="width: 99%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input size="normal" v-model="form.phone" autocomplete="off" style="width: 99%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input size="normal" v-model="form.email" autocomplete="off" style="width: 99%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拟留学身份" prop="studyPlan">
              <el-select
                v-model="form.studyPlan"
                size="normal"
                placeholder="请选择"
                style="width: 99%;"
              >
                <el-option label="博士联合培养" value="博士联合培养"></el-option>
                <el-option label="攻读博士学位" value="攻读博士学位"></el-option>
                <el-option label="硕士联合培养" value="硕士联合培养"></el-option>
                <el-option label="攻读硕士学位" value="攻读硕士学位"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="外语成绩">
          <el-col :span="6">
            <el-input size="normal" v-model="form.languageAchievement" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业" prop="profession">
              <el-input
                size="normal"
                v-model="form.profession"
                autocomplete="off"
                style="width: 99%;"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="本科学校">
          <el-col :span="6">
            <el-input size="normal" v-model="form.undergraduateSchool" autocomplete="off"></el-input>
          </el-col>
            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-date-picker
                v-model="form.grade"
                type="date"
                format="yyyy"
                placeholder="选择日期时间"
                style="width: 99%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="留学单位（英文）" prop="studySchool">
          <el-input size="normal" v-model="form.studySchool" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="国内导师" prop="internalTutor">
          <el-input size="normal" v-model="form.internalTutor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="海外导师" prop="overseasTutor">
          <el-input size="normal" v-model="form.overseasTutor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学习期限" prop="studyTime">
          <el-date-picker
            size="normal"
            type="date"
            placeholder="选择日期"
            v-model="form.studyTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
          <!-- <el-col class="line" :span="0.5">-</el-col>
          <el-col :span="5">
            <el-date-picker
              size="normal"
              type="date"
              placeholder="选择时间"
              v-model="form.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>-->
        </el-form-item>
        <!-- <el-form-item label="学习形式">
          <el-col :span="6">
            <el-input size="normal" v-model="form.learningWay" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="normal" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="资助类型" prop="fundingType">
          <el-select v-model="form.fundingType" size="normal" placeholder="请选择">
            <el-option label="基金委申报" value="基金委申报"></el-option>
            <el-option label="合作项目" value="合作项目"></el-option>
            <el-option label="学校资助" value="学校资助"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="form.auditFlag" size="normal" placeholder="请选择状态">
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
      deptid: "",
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
        "1": "已审核",
        "2": "未通过"
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
          location.href =
            "http://bsoa.csu.edu.cn/excel-model/数据库-出国学生.xls";
          break;
        case "download":
          this.exportData();
          break;
      }
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
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
        link.setAttribute("download", "数据库-出国学生.xls");
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
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
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