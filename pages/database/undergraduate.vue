<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年级:">
          <el-select v-model="query.term" size="normal">
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2016" value="2016"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号:">
          <el-input v-model="query.num" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="专业:">
          <el-select v-model="query.major" size="normal">
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
          <el-button size="normal" type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="num" align="center" label="学号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="major" align="center" label="录取专业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="年级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="teacher" align="center" label="导师"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="scholarship" align="center" label="奖学金名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="stipend" align="center" label="助学金名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="grade" align="center" label="年级"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="graduationSchool" align="center" label="毕业学校"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="graduation" align="center" label="毕业专业"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remarks" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="normal">查看</el-button>
          <el-button type="text" size="normal">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </nav>

    <el-drawer
      style="min-height:500px"
      :visible.sync="dialogFormVisible"
      :disabled="!['edit', 'add'].includes(operate)"
    >
      <el-form :model="form" label-width="150px">
        <el-form-item label="姓名">
          <el-col :span="6">
            <el-input size="normal" v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学号">
          <el-col :span="6">
            <el-input size="normal" v-model="form.num" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" size="normal">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录取专业">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年级">
          <el-col :span="6">
            <el-input size="normal" v-model="form.major" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号">
          <el-col :span="6">
            <el-input size="normal" v-model="form.tell" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="导师">
          <el-col :span="6">
            <el-input size="normal" v-model="form.teacher" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="奖学金名称">
          <el-col :span="6">
            <el-input size="normal" v-model="form.scholarship" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="助学金名称">
          <el-col :span="6">
            <el-input size="normal" v-model="form.stipend" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业学校">
          <el-col :span="6">
            <el-input size="normal" v-model="form.graduationSchool" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="毕业专业">
          <el-col :span="6">
            <el-input size="normal" v-model="form.graduation" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="normal" label="备注">
          <el-col :span="6">
            <el-input v-model="form.remarks" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-drawer>
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
        num: "",
        term: "2019",
        major: "1",
        graduation: "",
        graduationSchool: ""
      },
      form: {
        num: "",
        name: "",
        gender: "1",
        education: "",
        major: "",
        tell: "",
        mail: "",
        teacher: "",
        majorCode: "",
        scholarship: "",
        stipend: "",
        grade: "",
        graduationSchool: "",
        graduation: "",
        admissionType: "",
        remarks: ""
      },
      operate: [],
      tableData: []
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
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>