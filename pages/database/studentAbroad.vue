<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-select v-model="query.grade" size="small">
            <el-option label="全部" value></el-option>
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2016" value="2016"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本人身份:">
          <el-select v-model="query.identity" size="small">
            <el-option label="全部" value></el-option>
            <el-option label="本科" value="1"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="3"></el-option>
            <el-option label="硕博连读" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字:">
          <el-input size="small" v-model="query.keyword" placeholder="可输入关键字查询"></el-input>
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-date-picker
            v-model="query.startTime"
            type="date"
            format="yyyy-MM"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间:">
          <el-date-picker v-model="query.endTime" type="date" format="yyyy-MM" placeholder="选择日期时间"></el-date-picker>
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
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="studentId" align="center" label="学号"></el-table-column>
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
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <!-- <el-table-column fixed prop="studentId" align="center" label="编号"></el-table-column>
      <el-table-column prop="name" align="center" label="学生姓名"></el-table-column>
      <el-table-column prop="gender" align="center" label="学号"></el-table-column>
       <el-table-column prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column prop="birthday" align="center" label="生日"></el-table-column>
      <el-table-column prop="phone" align="center" label="在读学位类型"></el-table-column>
      <el-table-column prop="email" align="center" label="在专"></el-table-column>
      <el-table-column prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column prop="studyPlan" align="center" label="国内导师"></el-table-column>
      <el-table-column prop="identity" align="center" label="拟留学身份"></el-table-column>
      <el-table-column prop="undergraduateSchool" align="center" label="留学单位（英文）"></el-table-column>
      <el-table-column prop="grade" align="center" label="海外导师"></el-table-column>
      <el-table-column prop="studySchool" align="center" label="学习期限"></el-table-column>
      <el-table-column prop="startTime" align="center" label="资助类型"></el-table-column>
      <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>-->
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

    <el-dialog
      style="min-height:500px"
      title="出国学生"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="本人身份">
          <el-select v-model="form.identity" size="small">
            <el-option label="本科" value="1"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="3"></el-option>
            <el-option label="硕博连读" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号">
          <el-col :span="6">
            <el-input size="small" v-model="form.studentId" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名">
          <el-col :span="6">
            <el-input size="small" v-model="form.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" size="small">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-col :span="6">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              v-model="form.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号">
          <el-col :span="6">
            <el-input size="small" v-model="form.phone" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-col :span="6">
            <el-input size="small" v-model="form.email" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="拟留学身份">
          <el-select v-model="form.studyPlan" size="small">
            <el-option label="博士联合培养" value="1"></el-option>
            <el-option label="攻读博士学位" value="2"></el-option>
            <el-option label="硕士联合培养" value="3"></el-option>
            <el-option label="攻读硕士学位" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="外语成绩">
          <el-col :span="6">
            <el-input size="small" v-model="form.languageAchievement" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="专业">
          <el-col :span="6">
            <el-input size="small" v-model="form.profession" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="本科学校">
          <el-col :span="6">
            <el-input size="small" v-model="form.undergraduateSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年级">
          <el-col :span="6">
            <el-input size="small" v-model="form.grade" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="留学学校">
          <el-col :span="6">
            <el-input size="small" v-model="form.studySchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="5">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              v-model="form.startTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="0.5">-</el-col>
          <el-col :span="5">
            <el-date-picker
              size="small"
              type="date"
              placeholder="选择时间"
              v-model="form.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="学习形式">
          <el-col :span="6">
            <el-input size="small" v-model="form.learningWay" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="small" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.identity === '3' || form.identity === '4'" label="申请状态">
          <el-select v-model="form.applicationStatus" size="small">
            <el-option label="基金委申报" value="1"></el-option>
            <el-option label="合作项目" value="2"></el-option>
            <el-option label="学校资助" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      total: 0,
      page: 1,
      operate: "",
      dialogFormVisible: false,
      query: {
        limit: 14,
        offset: 0,
        order: "remark",
        condition: ""
      },
      form: {
        studentId: "",
        name: "",
        gender: "1",
        identity: "1",
        studyPlan: "1",
        birthday: "",
        phone: "",
        email: "",
        profession: "",
        undergraduateSchool: "",
        grade: "2019级",
        studySchool: "",
        startTime: "",
        endTime: "",
        learningWay: "",
        applicationStatus: "1",
        remark: ""
      },
      tableData: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "startTime" || key == "endTime" || key == "birthday") {
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
    async submitForm(formactivityTheme) {
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
          gender: "1",
          identity: "1",
          studyPlan: "1",
          birthday: "",
          phone: "",
          email: "",
          profession: "",
          undergraduateSchool: "",
          grade: "2019级",
          studySchool: "",
          startTime: "",
          endTime: "",
          learningWay: "",
          applicationStatus: "1",
          remark: ""
        };
      } else {
        this.form = row;
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
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>