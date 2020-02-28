<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="申请时间:">
          <el-date-picker
            v-model="query.startTime"
            align="right"
            size="small"
            type="date"
            placeholder="开始时间">
          </el-date-picker>-
          <el-date-picker
            v-model="query.endTime"
            align="right"
            size="small"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="query.status" size="small">
            <el-option label="全部状态" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="待审核" value="3"></el-option>
            <el-option label="审核拒绝" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="query.type" size="small">
            <el-option label="全部类别" value="1"></el-option>
            <el-option label="获奖要报" value="2"></el-option>
            <el-option label="著作&教材" value="3"></el-option>
            <el-option label="优秀硕博士论文" value="4"></el-option>
            <el-option label="中文论文" value="5"></el-option>
            <el-option label="英文论文" value="6"></el-option>
            <el-option label="科研项目" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input
            id="teacherName"
            style="width:200px; "
            placeholder="请输入姓名或工号"
            size="small"
            v-model="query.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="department" align="center" label="部门"></el-table-column>
      <el-table-column prop="type" align="center" label="类别"></el-table-column>
      <el-table-column prop="name" align="center" label="教师名称"></el-table-column>
      <el-table-column prop="tell" align="center" label="手机号码"></el-table-column>
      <el-table-column prop="createTime" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="examineTime" align="center" label="审核时间"></el-table-column>
      <el-table-column prop="status" align="center" label="状态"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </nav>
  </div>
</template>

<script>
export default {
  layout: "normal",
  components: {},
  data() {
    return {
      query: {
        startTime: '',
        endTime: '',
        status: '1',
        type: '1',
        name: ''
      },
      form: {
        startTime: "",
        endTime: "",
        status: "4",
        teacher: "all",
        department: "all",
        type: "all"
      },
      tableData: [
        {
          name: "张安",
          department: "教学部",
          type: "课堂教学",
          tell: "13555226685",
          createTime: "2019-11-05",
          examineTime: "2019-11-05",
          status: "已审核"
        },
        {
          name: "张安",
          department: "教学部",
          type: "课堂教学",
          tell: "13555226685",
          createTime: "2019-11-05",
          examineTime: "2019-11-05",
          status: "已审核"
        },
        {
          name: "张安",
          department: "教学部",
          type: "课堂教学",
          tell: "13555226685",
          createTime: "2019-11-05",
          examineTime: "2019-11-05",
          status: "已审核"
        },
        {
          name: "张安",
          department: "教学部",
          type: "课堂教学",
          tell: "13555226685",
          createTime: "2019-11-05",
          examineTime: "2019-11-05",
          status: "已审核"
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
#teacherName {
  width: 200px;
  /* float: left; */
}
</style>