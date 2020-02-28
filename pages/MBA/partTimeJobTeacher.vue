<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年份:">
          <el-select v-model="query.year" size="small">
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2016" value="2016"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.id" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-select v-model="query.major" size="small">
            <el-option label="金融硕士" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导师:">
          <el-input v-model="query.teacher" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="毕业专业:">
          <el-input v-model="query.graduation" placeholder="请输入毕业专业"></el-input>
        </el-form-item>
        <el-form-item label="毕业学校:">
          <el-input v-model="query.graduationSchool" placeholder="请输入毕业学校"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="year" align="center" label="姓名"></el-table-column>
      <el-table-column prop="id" align="center" label="性别"></el-table-column>
      <el-table-column prop="name" align="center" label="教师姓名"></el-table-column>
      <el-table-column prop="entrance" align="center" label="指导研究生类别"></el-table-column>
      <el-table-column prop="student" align="center" label="指导研究生姓名"></el-table-column>
      <el-table-column prop="graduationStudent" align="center" label="研究生人数"></el-table-column>
      <el-table-column prop="admission" align="center" label="工作量"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </nav>

    <el-dialog style="min-height:500px"  :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-col :span="6">
            <el-input size="small" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学号">
          <el-col :span="6">
            <el-input size="small" v-model="form.id" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" size="small">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录取专业">
          <el-col :span="6">
            <el-input size="small" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号">
          <el-col :span="6">
            <el-input size="small" v-model="form.tell" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师">
          <el-col :span="6">
            <el-input size="small" v-model="form.teacher" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="奖学金名称">
          <el-col :span="6">
            <el-input size="small" v-model="form.scholarship" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="助学金名称">
          <el-col :span="6">
            <el-input size="small" v-model="form.stipend" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业学校">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduationSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业">
          <el-col :span="6">
            <el-input size="small" v-model="form.graduation" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="small" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remarks" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      query: {
        id: "",
        entrance: "",
        year: "2019",
        graduation: "",
        student: "",
        graduationStudent: "",
        fullTime: "",
        unfullTime: "",
        source: "",
        apply: "",
        admission: "",
        grant: "",
        eliminate: ""
      },
      form: {
        id: "",
        entrance: "",
        year: "2019",
        graduation: "",
        student: "",
        graduationStudent: "",
        fullTime: "",
        unfullTime: "",
        source: "",
        apply: "",
        admission: "",
        grant: "",
        eliminate: "",
        admissionRate: ""
      },
      tableData: [
        {
          id: "001",
          entrance: "",
          year: "2019",
          graduation: "",
          student: "",
          graduationStudent: "",
          fullTime: "",
          unfullTime: "",
          source: "",
          apply: "",
          admission: "",
          grant: "",
          eliminate: "",
          admissionRate: ""
        },
        {
          id: "0002",
          name: "李青松",
          gender: "男",
          major: "软件工程",
          tell: "11122225556",
          teacher: "陈晓红",
          scholarship: "推免生奖学金",
          stipend: "免推助学金",
          grade: "2019级",
          graduationSchool: "湖南师范大学",
          graduation: "金融学",
          remarks: "123"
        },
        {
          id: "0002",
          name: "李青松",
          gender: "男",
          major: "软件工程",
          tell: "11122225556",
          teacher: "陈晓红",
          scholarship: "推免生奖学金",
          stipend: "不享受",
          grade: "2019级",
          graduationSchool: "湖南师范大学",
          graduation: "金融学",
          remarks: "123"
        }
      ]
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
</style>