<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="活动主题:">
          <el-input v-model="query.activityTheme" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="负责部门:">
          <el-input v-model="query.department" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学期">
          <el-input size="small" v-model="query.semester" placeholder="请输入学期"></el-input>
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
      <el-table-column prop="activityTheme" align="center" label="活动主题"></el-table-column>
      <el-table-column prop="activityTime" align="center" label="活动时间"></el-table-column>
      <el-table-column prop="content" align="center" label="活动内容"></el-table-column>
      <el-table-column prop="department" align="center" label="负责部门"></el-table-column>
      <el-table-column prop="semester" align="center" label="学期"></el-table-column>
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
      title="通讯录"
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
        <el-form-item label="活动主题" prop="activityTheme">
          <el-col :span="6">
            <el-input size="small" v-model="form.activityTheme"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <el-col :span="6">
            <el-input size="small" v-model="form.activityTime"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-col :span="6">
            <el-input size="small" v-model="form.content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="负责部门" prop="department">
          <el-col :span="6">
            <el-select v-model="form.department" placeholder="请选择部门" prop="fullname">
              <el-option
                v-for="item in depList"
                :key="item.id"
                :label="item.fullname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-col :span="6">
            <el-input size="small" v-model="form.semester"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="['edit', 'add'].includes(operate)" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small">确定</el-button>
        <el-button size="small" @click="resetForm('form')">重置</el-button>
      </div>
    </el-dialog>
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
      total: 0,
      page: 1,
      operate: "",
      dialogFormVisible: false,
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      depList: {},
      form: {
        activityTheme: "",
        semester: "",
        activityTime: "",
        department: "",
        content: ""
      },
      rules: {
        namactivityThemee: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        activityTheme: [
          { required: true, message: "请输入活动主题", trigger: "blur" }
        ],
        department: [
          { required: true, message: "请输入活动部门", trigger: "blur" }
        ],
        semester: [{ required: true, message: "请输入学期", trigger: "blur" }],
        activityTime: [
          { required: true, message: "请输入互动时间", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入活动内容", trigger: "blur" }
        ]
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
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    async list() {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("userInfo");
      if (user.roleid == 7) {
        this.query.editor = user.id;
      }
      let res = await axios.$post("/event/list", this.query);
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          const element = res.rows[i];
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const item = element[key];
              if (key == "interviewTime") {
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
          await axios.$post("/event/add", this.form);
          break;
        case "edit":
          await axios.$post("/event/update", this.form);
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
          id: "",
          visitor: "",
          accessType: "",
          interviewTime: "",
          jobTitle: "",
          citizenshipCountry: "",
          unit: "",
          expertCategory: "",
          researchAreas: "",
          communicationContent: "",
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
          let eventId = row.id;
          await axios.$post("/event/delete", {
            eventId: eventId
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
    let deps = await axios.$post("/dept/list", {
      limit: 9999999,
      offset: 0,
      order: "desc",
      condition: ""
    });
    this.depList = deps;
    console.log(deps);
    this.list();
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>