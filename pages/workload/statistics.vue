<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="年度:">
          <el-date-picker
            size="normal"
            v-model="query.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="类型:">
          <el-select v-model="query.type" size="normal">
            <el-option label="全部" value="1"></el-option>
            <el-option label="研究生指导" value="2"></el-option>
            <el-option label="课堂教学" value="3"></el-option>
            <el-option label="实习" value="4"></el-option>
            <el-option label="沙盘模拟" value="5"></el-option>
            <el-option label="社会调查" value="6"></el-option>
            <el-option label="论文指导" value="7"></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="教师:">
          <el-input id="nameBox" v-model="query.condition" placeholder="姓名或工号" size="normal"></el-input>
        </el-form-item>-->
        <el-form-item label="教师:">
          <el-select v-model="query.userName" filterable placeholder="请选择老师" prop style="width:98%">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="downLoad">计算规则</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userId"
        label="ID"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年度"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="教师"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="scores" align="center" label="总工作量"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="showDialog(scope.row)" type="text" size="normal">详情</el-button>
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

    <el-drawer size="60%" style="min-height:500px" title="详情" :visible.sync="dialogDetailVisible">
      <Highcharts id="图例" :option="option" />
    </el-drawer>
  </div>
</template>

<script>
import moment from "moment";
import Highcharts from "~/components/Highcharts.vue";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  components: {
    Highcharts
  },
  data() {
    return {
      total: 0,
      page: 0,
      loading: true,
      dialogDetailVisible: false,
      option: {
        credits: {
          enabled: false
        },
        chart: {
          type: "bar"
        },
        title: {
          text: "工作量分类统计"
        },

        subtitle: {
          text: ""
        },
        xAxis: {
          categories: [],
          crosshair: true
        },
        yAxis: {
          tickPixelInterval: 1,
          min: 0,
          title: {
            text: "课时",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        tooltip: {
          valueSuffix: " 课时"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              allowOverlap: true // 允许数据标签重叠
            }
          }
        },
        series: []
      },
      query: {
        limit: 10,
        offset: 0,
        type: "",
        userId: "",
        userName: "",
        year: moment().format("YYYY")
      },
      teacherList: [],
      tableData: []
    };
  },

  async mounted() {
    this.teacherList = await axios.$post("/mgr/list", {
      order: "desc",
      offset: 0,
      limit: 999999
    });
    this.teacherList = this.teacherList.rows;
    this.list();
  },
  filters: {
    typeFilter: function(value) {
      let data = {
        "1": "全部",
        "2": "研究生指导",
        "3": "课堂教学",
        "4": "实习",
        "5": "沙盘模拟",
        "6": "社会调查",
        "7": "论文指导"
      };
      return data[value];
    }
  },
  methods: {
    downLoad() {
      window.open(
        "http://bsoa.csu.edu.cn/files/中商办字[2019]06号商学院教学与行政工作量计算办法.pdf"
      );
    },
    async queryTeacher(queryString, cb) {
      console.log(queryString);
      let teacher = await axios.$get("/mgr/quicklist", {
        name: queryString
      });
      var teachers = [];
      for (let i = 0; i < teacher.length; i++) {
        const element = teacher[i];
        teachers.push({ value: element.name, id: element.id });
      }
      console.log(teachers);
      var results = queryString
        ? teachers.filter(this.createFilter(queryString))
        : teachers;
      cb(results);
    },
    createFilter(queryString) {
      return teacher => {
        return (
          teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      if (!this.query.year) {
        this.$message({
          type: "info",
          message: "请输入年份"
        });
        return;
      }
      this.loading = true;
      // 查询接口
      let user = localStorage.getItem("roles");
      let userInfo = localStorage.getItem("userInfo");
      // if (!user.includes(888) && userInfo.roleid != 19) {
      //   this.query.userId = localStorage.getItem("userId");
      //   this.role = false;
      // }

      let res = await axios.$post("workload/list", this.query);
      for (let i = 0; i < res.records.length; i++) {
        res.records[i].scores = 0;
        res.records[i].year = this.query.year;
        for (let j in res.records[i].score) {
          res.records[i].scores += res.records[i].score[j][this.query.year];
        }
        res.records[i].scores = res.records[i].scores.toFixed(2);
      }
      this.total = parseInt(res.total);
      this.tableData = res.records;
      this.loading = false;
    },
    async showDialog(row) {
      // 查询接口
      // this.option.xAxis.categories = [];
      this.option.series = [];
      console.log(this.option.xAxis.categories, "=========categories");
      let series = [];
      let categories = [];
      let res = await axios.$get("workload/statistics", { userId: row.userId });
      let currentYear = moment().format("YYYY");
      for (const key in res) {
        categories.push(key);
      }
      for (let i = 2019; i <= parseInt(currentYear); i++) {
        let data = [];
        for (let key in res) {
          if (res[key][i]) {
            data.push(parseFloat(res[key][i].toFixed(2)));
          } else {
            data.push(0);
          }
        }
        series.push({
          name: i,
          data
        });
      }
      this.option.xAxis.categories = categories;
      this.option.series = series;
      this.dialogDetailVisible = true;
    }
  },
  watch: {
    option(newValue, oldValue) {
      console.log(newValue, "==========newValue");
    }
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