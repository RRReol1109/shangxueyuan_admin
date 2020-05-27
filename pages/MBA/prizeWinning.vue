<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-date-picker
            v-model="query.year"
            align="right"
            size="small"
            type="date"
            format="yyyy"
            value-format="yyyy"
            placeholder="年级"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="教师姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="small"></el-input>
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
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="small" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" v-if="roleId==1">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/teacherAward/upload?token='AuthenticationToken'"
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
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column fixed prop="year" align="center" label="年份"></el-table-column>
      <el-table-column prop="teacherId" align="center" label="教师工号"></el-table-column>
      <el-table-column prop="name" align="center" label="教师姓名"></el-table-column>
      <el-table-column prop="title" align="center" label="职称"></el-table-column>
      <el-table-column prop="awardName" align="center" label="获奖项目名称"></el-table-column>
      <el-table-column prop="awardLevel" align="center" label="奖项类别"></el-table-column>
      <el-table-column prop="awardType" align="center" label="奖励级别"></el-table-column>
      <el-table-column prop="awardOrganize" align="center" label="颁奖机构"></el-table-column>
      <el-table-column prop="awardId" align="center" label="获奖证书编号"></el-table-column>
      <el-table-column prop="awardDate" align="center" label="获奖年月"></el-table-column>
      <el-table-column prop="pdfUrl" align="center" label="上传获奖证书PDF电子版"></el-table-column>
      <el-table-column prop="ratio" align="center" label="系数"></el-table-column>
      <el-table-column prop="point" align="center" label="业绩点"></el-table-column>
      <el-table-column prop="score" align="center" label="考核分"></el-table-column>
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
            <el-button @click="examineDialog = false" size="small">取 消</el-button>
            <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer
      style="min-height:500px"
      title
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-form-item label="年份" prop="year">
          <el-col :span="6">
            <el-date-picker
              v-model="form.year"
              type="date"
              format="yyyy"
              value-format="yyyy"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="教师工号" prop="teacherId">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacherId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-col :span="6">
            <el-input size="small" v-model="form.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="获奖项目名称" prop="awardName">
          <el-col :span="6">
            <el-input size="small" v-model="form.awardName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="奖项类别" prop="awardType">
          <el-col :span="6">
            <el-select v-model="form.awardType" size="small" placeholder="请选择">
              <el-option label="国家科技进步奖" value="国家科技进步奖"></el-option>
              <el-option label="成果要报" value="成果要报"></el-option>
              <el-option label="教育部科学技术奖" value="教育部科学技术奖"></el-option>
              <el-option label="教育部人文社科奖" value="教育部人文社科奖"></el-option>
              <el-option label="湖南省科技进步奖" value="湖南省科技进步奖"></el-option>
              <el-option label="湖南省哲学社会科学优秀成果奖" value="湖南省哲学社会科学优秀成果奖"></el-option>
              <el-option label="国家教学成果奖" value="国家教学成果奖"></el-option>
              <el-option label="湖南省教学成果奖" value="湖南省教学成果奖"></el-option>
              <el-option label="中南大学教学成果奖" value="中南大学教学成果奖"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="奖励级别" prop="awardLevel">
          <el-col :span="6">
            <el-select v-model="form.type" size="awardLevel" placeholder="请选择">
              <el-option label="一等" value="一等"></el-option>
              <el-option label="二等" value="二等"></el-option>
              <el-option label="三等" value="三等"></el-option>
              <el-option label="优秀成果奖" value="优秀成果奖"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="颁奖机构" prop="awardOrganize">
          <el-col :span="6">
            <el-input size="small" v-model="form.awardOrganize"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="获奖证书编号" prop="awardId">
          <el-col :span="6">
            <el-input size="small" v-model="form.awardId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="获奖年月" prop="awardDate">
          <el-col :span="6">
            <el-date-picker
              v-model="form.awardDate"
              type="date"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="选择日期时间"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="上传获奖证书PDF电子版" prop="pdfUrl">
          <el-col :span="6">
            <el-input size="small" v-model="form.pdfUrl"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="系数" prop="ratio">
          <el-col :span="6">
            <el-input size="small" v-model="form.ratio"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="业绩点" prop="point">
          <el-col :span="6">
            <el-input size="small" v-model="form.point"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="考核分" prop="score">
          <el-col :span="6">
            <el-input size="small" v-model="form.score"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" style="float:right;">
        <el-button @click="examineDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="examineData('examineForm')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('examineForm')">重置</el-button>
      </div>
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
        year: "",
        teacherId: "",
        name: "",
        title: "",
        awardName: "",
        awardLevel: "",
        awardType: "",
        awardOrganize: "",
        awardId: "",
        awardDate: "",
        pdfUrl: "",
        ratio: "",
        point: "",
        score: ""
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
      let res = await axios.$post("/teacherAward/list", this.query);
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
        await axios.$post("/teacherAward/update", this.examineForm);
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
          await axios.$post("/teacherAward/add", this.form);
          break;
        case "edit":
          await axios.$post("/teacherAward/update", this.form);
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
          year: "",
          teacherId: "",
          name: "",
          title: "",
          awardName: "",
          awardLevel: "",
          awardType: "",
          awardOrganize: "",
          awardId: "",
          awardDate: "",
          pdfUrl: "",
          ratio: "",
          point: "",
          score: ""
        };
      } else {
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
          location.href = "http://112.74.56.60/excel/excel-model/sjk-lxsxx.xls";
          break;
      }
    },
    async exportData() {
      let data = await axios.$download("/teacherAward/export", {
        params: this.query
      });
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
            await axios.$post("/teacherAward/delete", {
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
          await axios.$post("/teacherAward/delete", {
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
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}
</style>