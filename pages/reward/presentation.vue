<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="项目级别:">
          <el-select v-model="query.level" size="normal" placeholder="请选择级别">
            <el-option label="全部" value></el-option>
            <el-option label="国家级" value="1"></el-option>
            <el-option label="省部级" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="获奖类型:">
          <el-select v-model="query.type" size="normal" placeholder="请选择类型">
            <el-option label="全部" value></el-option>
            <el-option label="国家级“三大奖”" value="国家级“三大奖”"></el-option>
            <el-option label="教育部人文社科奖" value="教育部人文社科奖"></el-option>
            <el-option label="省部级" value="省部级"></el-option>
            <el-option label="国家自科基金和国家社科基金结题评估" value="国家自科基金和国家社科基金结题评估"></el-option>
            <el-option label="入选 CTTI 智库" value="入选 CTTI 智库"></el-option>
            <el-option label="科睿唯安高被引" value="科睿唯安高被引"></el-option>
            <el-option label="成果入选《高校智库专刊》" value="成果入选《高校智库专刊》"></el-option>
            <el-option label="成果入选教育部社科委 《专家建议》" value="成果入选教育部社科委 《专家建议》"></el-option>
            <el-option label="成果入选中宣部社科规划办《成果要报》" value="成果入选中宣部社科规划办《成果要报》"></el-option>
            <el-option label="成果入选人民日报(理论版)" value="成果入选人民日报(理论版)"></el-option>
            <el-option label="成果入选光明日报(理论版)" value="成果入选光明日报(理论版)"></el-option>
            <el-option label="成果入选经济日报(理论版)" value="成果入选经济日报(理论版)"></el-option>
            <el-option label="成果获得领导批示" value="成果获得领导批示"></el-option>
            <el-option label="专利(含软件著作权)" value="专利(含软件著作权)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第一完成单位：">
          <el-input v-model="query.firstUnit" placeholder="请输入单位" size="normal"></el-input>
        </el-form-item>
        <el-form-item label="第一获奖人:">
          <el-input v-model="query.firstPerson" placeholder="请输入毕业专业" size="normal"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <!-- <el-form-item label="附件" prop="file">
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
        <el-form-item label >
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item >
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine" >批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/awardResult/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传数据</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pick"
        fixed
        align="center"
        label="选择"
        width="50"
      >
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" align="center" label="获奖类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="level" align="center" label="项目级别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="awardName" align="center" label="成果名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="firstUnit" align="center" label="第一完成单位"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="firstPerson"
        align="center"
        label="第一获奖人"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="persons" align="center" label="全体获奖人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="awardDate" align="center" label="获奖时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="300"
        
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
            <el-form-item label="审核状态:">
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
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false" size="normal">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="normal">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-date-picker
                size="normal"
                style="width:99%"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择年份"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input clearable v-model="ruleForm.name" placeholder="请输入内容" style="width:99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="获奖类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择类型" style="width:99%">
                <el-option label="国家级“三大奖”" value="国家级“三大奖”"></el-option>
                <el-option label="教育部人文社科奖" value="教育部人文社科奖"></el-option>
                <el-option label="省部级" value="省部级"></el-option>
                <el-option label="国家自科基金和国家社科基金结题评估" value="国家自科基金和国家社科基金结题评估"></el-option>
                <el-option label="入选 CTTI 智库" value="入选 CTTI 智库"></el-option>
                <el-option label="科睿唯安高被引" value="科睿唯安高被引"></el-option>
                <el-option label="成果入选《高校智库专刊》" value="成果入选《高校智库专刊》"></el-option>
                <el-option label="成果入选教育部社科委 《专家建议》" value="成果入选教育部社科委 《专家建议》"></el-option>
                <el-option label="成果入选中宣部社科规划办《成果要报》" value="成果入选中宣部社科规划办《成果要报》"></el-option>
                <el-option label="成果入选人民日报(理论版)" value="成果入选人民日报(理论版)"></el-option>
                <el-option label="成果入选光明日报(理论版)" value="成果入选光明日报(理论版)"></el-option>
                <el-option label="成果入选经济日报(理论版)" value="成果入选经济日报(理论版)"></el-option>
                <el-option label="成果获得领导批示" value="成果获得领导批示"></el-option>
                <el-option label="专利(含软件著作权)" value="专利(含软件著作权)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖项级别" prop="level">
              <el-select v-model="ruleForm.level" placeholder="请选择级别" style="width:99%">
                <el-option label="一等奖" value="一等奖"></el-option>
                <el-option label="二等奖" value="二等奖"></el-option>
                <el-option label="三等奖" value="三等奖"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成果名称" prop="awardName">
              <el-autocomplete
                clearable
                v-model="ruleForm.awardName"
                :fetch-suggestions="queryProjects"
                style="width:99%"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第一完成单位" prop="firstUnit">
              <el-autocomplete
                clearable
                v-model="ruleForm.firstUnit"
                :fetch-suggestions="queryProjects"
                style="width:99%"
                placeholder="请输入内容"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="附件" prop="file">
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
        <!-- <el-form-item :label="'获奖人及分数:'" prop="persons">
          <el-col :span="12">
            <label>获奖人姓名-分数</label>
            <el-input v-model="ruleForm.persons" rows="5" type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item
          v-for="(teacherArr, index) in teacherArr"
          :label="'作者信息' + (index+1)"
          :key="teacherArr.key"
          :prop="'teacherArr' + index"
        >
          <el-select v-model="teacherArr.name" placeholder="请选择老师" filterable　prop="name">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>分数:
          <el-input clearable style="width:120px" v-model="teacherArr.num" placeholder="请输入分数"></el-input>
          <el-button type="danger" style="width:100px;" @click="removeTeacher(teacherArr)">删除</el-button>
        </el-form-item>
        <el-form-item v-if="!['show'].includes(operate)">
          <el-button type="primary" @click="addTeacher('ruleForm')">继续添加老师</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第一获奖人" prop="firstPerson">
              <el-input
                clearable
                v-model="ruleForm.firstPerson"
                placeholder="请输入内容"
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖时间" prop="awardDate">
              <el-date-picker
                v-model="ruleForm.awardDate"
                type="date"
                placeholder="选择日期时间"
                style="width:99%"
              ></el-date-picker>
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
            :disabled="true"
            v-loading="fileLoading"
            header-row-class-name="h30"
            header-cell-class-name="tc-g2 bc-g"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              type="index"
              label="#"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop label="文件名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name.split('/').pop() }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
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
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      fileLoading: false,
      fileData: "",
      action: "",
      loading: true,
      yearsOptions: [],
      roleId: 0,
      examineDialog: false,
      fileList: [],
      deptid: "",
      operate: "",
      dialogFormVisible: false,
      total: 0,
      fileurl: "",
      page: 1,
      fileLists: [],
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      additionFiles: [],
      teacherList: [],
      header: {},
      tableData: [],
      ruleForm: {
        name: "",
        type: "1",
        level: "1",
        year: "",
        awardName: "",
        firstUnit: "",
        firstPerson: "",
        persons: "",
        awardDate: moment().format("YYYY-MM-DD")
      },
      teacherArr: [
        {
          name: "",
          num: ""
        }
      ],
      rules: {
        year: [{ required: true, message: "请输入年份", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        awardName: [
          { required: true, message: "请输入成果名称", trigger: "blur" }
        ],
        firstUnit: [
          { required: true, message: "请输入第一完成单位", trigger: "blur" }
        ],
        level: [{ required: true, message: "请选择项目级别", trigger: "blur" }],
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        firstPerson: [
          { required: true, message: "请输入第一获奖人", trigger: "blur" }
        ],
        persons: [{ required: true, message: "请输入获奖人", trigger: "blur" }],
        awardDate: [
          { required: true, message: "请输入获奖时间", trigger: "blur" }
        ]
      },
      rewardNames: []
    };
  },
  mounted() {
    this.awardName = localStorage.getItem("awardName")
      ? JSON.parse(localStorage.getItem("awardName"))
      : [];
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
    downLoadFile(rows) {
      alert(rows);
      if (rows.files) {
        window.open(rows.files);
      } else {
        this.$message({
          type: "info",
          message: "该条记录无附件"
        });
      }
    },
    async uploadAdditionSuccess(response) {
      console.log("this.ruleForm:::", this.ruleForm);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.ruleForm.files = JSON.stringify(this.additionFiles);
          await axios.$post("/awardResult/update", this.ruleForm);
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
        await axios.$post("/awardResult/update", this.ruleForm);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.rewardNames.push({
        value: this.ruleForm.awardName
      });
      this.rewardNames = _.uniqWith(this.rewardNames, _.isEqual);
      localStorage.setItem("rewardNames", JSON.stringify(this.rewardNames));
    },
    queryProjects(queryString, cb) {
      var rewardNames = this.rewardNames;
      var results = queryString
        ? rewardNames.filter(this.createProjectsFilter(queryString))
        : rewardNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createProjectsFilter(queryString) {
      return rewardNames => {
        return (
          rewardNames.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    addAwardees() {
      this.ruleForm.persons.push({
        value: "",
        key: Date.now() + "persons"
      });
    },
    removeAwardees(item) {
      var index = this.ruleForm.persons.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.persons.splice(index, 1);
      }
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
    async list() {
      this.loading = true;
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "awardDate") {
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
        this.query.editor = localStorage.getItem("userId");
      }
      let res = await axios.$post("/awardResult/list", this.query);
      this.tableData = res.rows;
      this.total = parseInt(res.total);
      this.loading = false;
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/awardResult/export?id=-1", {});
      } else {
        data = await axios.$download("/awardResult/export", {
          params: this.query
        });
      }

      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-获奖.xls");
        document.body.appendChild(link);
        link.click();
      }
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
        num: ""
      });
    },
    async submitForm(formName) {
      this.ruleForm.persons = "";
      for (let i = 0; i < this.teacherArr.length; i++) {
        let element = this.teacherArr[i];
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            let info = element[key];
            let tid = "";
            console.log(info);
            if (key == "name") {
              for (let j = 0; j < this.teacherList.length; j++) {
                const item = this.teacherList[j];
                if (info == item.name) {
                  tid = item.id;
                }
              }

              if (tid) this.ruleForm.persons += tid;
              else this.ruleForm.persons += info.toString();
              // alert(info);
            }
            if (key == "num") {
              this.ruleForm.persons += "|" + info + ",";
            }
          }
        }
        if (i == this.teacherArr.length - 1) {
          this.ruleForm.persons = this.ruleForm.persons.substr(
            0,
            this.ruleForm.persons.length - 1
          );
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
      if (this.ruleForm.files)
        this.ruleForm.files = JSON.stringify(this.additionFiles);
      switch (this.operate) {
        case "add":
          this.ruleForm.files = this.fileurl;
          await axios.$post("/awardResult/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          await axios.$post("/awardResult/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          id: "",
          name: "",
          type: "",
          level: "",
          awardName: "",
          firstUnit: "",
          firstPerson: "",
          persons: "",
          awardDate: moment().format("YYYY-MM-DD"),
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        this.teacherArr = [
          {
            name: "",
            num: ""
          }
        ];
        this.additionFiles = [];
      } else {
        this.ruleForm = row;
        if (row.files) this.additionFiles = JSON.parse(row.files);
        this.teacherArr = [];
        let teacherInfo = row.persons.split(",");
        for (let i = 0; i < teacherInfo.length; i++) {
          const element = teacherInfo[i];
          this.teacherArr.push({
            name: "",
            num: ""
          });
          let teacher = element.split("|");
          for (let j = 0; j < teacher.length; j++) {
            const item = teacher[j];
            console.log(item, "======item");
            if (j % 2 == 0) {
              // this.teacherArr[i].name = item.toString();
              // this.teacherArr[i].name = this.teacherArr[i].name + "";
              for (let k = 0; k < this.teacherList.length; k++) {
                const teachers = this.teacherList[k];
                if (item == teachers.id) {
                  this.teacherArr[i].name = teachers.name;
                }
              }
            } else if (j % 2 == 1) {
              this.teacherArr[i].num = item;
            }
          }
        }
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
          let awardResultId = row.id;
          await axios.$post("/awardResult/delete", {
            awardResultId: awardResultId
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
    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        console.log(element);
        this.fileurl += element.response;
      }
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

    async changeFlag(row) {
      row.pick = !row.pick;
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
            let awardResultId = element.id;
            await axios.$post("/awardResult/delete", {
              awardResultId: awardResultId
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
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999
      });
      this.teacherList = this.teacherList.rows;
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
        await axios.$post("/awardResult/update", this.examineForm);
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
    this.list();
    await this.queryTeacher();
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
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
</style>