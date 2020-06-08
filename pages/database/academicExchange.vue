<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="来访时间:">
          <el-date-picker
            v-model="query.interviewTime"
            align="right"
            size="normal"
            type="date"
            placeholder="来访时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专家姓名:">
          <el-input v-model="query.visitor" size="normal" placeholder="请输入专家姓名"></el-input>
        </el-form-item>
        <el-form-item label="邀请人:">
          <el-input v-model="query.inviter" size="normal" placeholder="请输入邀请人"></el-input>
        </el-form-item>
        <el-form-item label="专家类别">
          <el-select v-model="query.expertCategory" size="normal" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="国内" value="国内"></el-option>
            <el-option label="国外" value="国外"></el-option>
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
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bsoa.csu.edu.cn/bs/academicExchange/upload?token='AuthenticationToken'"
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
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column fixed prop="pick" align="center" label="选择" width="50">
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="interviewTime"
        align="center"
        label="来访时间"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="accessType" align="center" label="访问类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="visitor" align="center" label="专家姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="passport" align="center" label="护照号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="jobTitle" align="center" label="职称"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="citizenshipCountry"
        align="center"
        label="国籍"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="unit" align="center" label="工作单位"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="expertCategory"
        align="center"
        label="专家类别"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="researchAreas"
        align="center"
        label="研究领域"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="discipline" align="center" label="所属学科"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="communicationContent"
        align="center"
        label="交流内容"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="inviter" align="center" label="邀请人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditFlag | statusFilter}}</span>
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
              <el-option label="审核未通过" value="2"></el-option>
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
    <el-drawer
      style="min-height:500px"
      size="60%"
      title="学术交流"
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
        label-width="150px"
        ref="form"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="专家姓名" prop="visitor">
              <el-input size="normal" v-model="form.visitor" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问类型" prop="accessType">
              <el-input
                size="normal"
                v-model="form.accessType"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职称" prop="jobTitle">
              <el-select v-model="form.jobTitle" size="normal" placeholder="请输入" style="width:99%">
                <el-option label="教授" value="教授"></el-option>
                <el-option label="副教授" value="副教授"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护照号" prop="passport">
              <el-input size="normal" v-model="form.passport" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="国籍" prop="citizenshipCountry">
              <el-input
                size="normal"
                v-model="form.citizenshipCountry"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="unit">
              <el-input size="normal" v-model="form.unit" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专家类别" prop="expertCategory">
              <el-select
                v-model="form.expertCategory"
                size="normal"
                placeholder="请输入"
                style="width:99%"
              >
                <el-option label="国内" value="国内"></el-option>
                <el-option label="国外" value="国外"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访时间" prop="interviewTime">
              <el-date-picker
                size="normal"
                type="date"
                placeholder="选择日期"
                v-model="form.interviewTime"
                style="width: 99%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究领域" prop="researchAreas">
              <el-input
                size="normal"
                v-model="form.researchAreas"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学科" prop="discipline">
              <el-input
                size="normal"
                v-model="form.discipline"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邀请人" prop="inviter">
              <el-input size="normal" v-model="form.inviter" autocomplete="off" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交流内容" prop="communicationContent">
              <el-input
                size="normal"
                v-model="form.communicationContent"
                autocomplete="off"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item size="normal" label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" style="width:99%"></el-input>
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
      fileList: [],
      header: {},
      roleId: 0,
      examineDialog: false,
      examineForm: {},
      form: {
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
      },

      rules: {
        interviewTime: [
          { required: true, message: "请输入来访时间", trigger: "blur" }
        ],
        visitor: [
          { required: true, message: "请输入专家姓名", trigger: "blur" }
        ],
        jobTitle: [{ required: true, message: "请输入职称", trigger: "blur" }],
        accessType: [
          { required: true, message: "请输入访问类型", trigger: "blur" }
        ],
        unit: [{ required: true, message: "请输入工作单位", trigger: "blur" }],
        expertCategory: [
          { required: true, message: "请输入专家类别", trigger: "blur" }
        ],
        researchAreas: [
          { required: true, message: "请输入研究领域", trigger: "blur" }
        ],
        inviter: [{ required: true, message: "请输入邀请人", trigger: "blur" }],
        discipline: [
          { required: true, message: "请输入所属学科", trigger: "blur" }
        ],
        passport: [
          { required: true, message: "请输入护照号", trigger: "blur" }
        ],
        citizenshipCountry: [
          { required: true, message: "请输入国籍", trigger: "blur" }
        ],
        communicationContent: [
          { required: true, message: "请输入交流类容", trigger: "blur" }
        ]
      },
      tableData: []
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "审核已通过",
        "2": "审核未通过"
      }[value.toString()];
    }
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
      this.tableData = [];
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
      let res = await axios.$post("/academicExchange/list", this.query);
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
        await axios.$post("/academicExchange/update", this.examineForm);
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
          location.href = "http://bsoa.csu.edu.cn/excel-model/sjk-xsjl.xls";
          break;
        case "download":
          this.exportData();
          break;
      }
    },

    uploadSuccess() {
      this.list();
    },

    async exportData() {
      let data = await axios.$download("/academicExchange/export", {
        params: this.query
      });
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "sjk-xsjl.xls");
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
            let academicExchangeId = element.id;
            await axios.$post("/academicExchange/delete", {
              academicExchangeId: academicExchangeId
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
          await axios.$post("/academicExchange/add", this.form);
          break;
        case "edit":
          await axios.$post("/academicExchange/update", this.form);
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
          let academicExchangeId = row.id;
          await axios.$post("/academicExchange/delete", {
            academicExchangeId: academicExchangeId
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