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
        <el-form-item label="系别" prop="department">
          <el-select v-model="query.department" size="normal" placeholder="请选择" style="width:99%">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="管理科学与信息管理系" value="管理科学与信息管理系"></el-option>
            <el-option label="企业管理系" value="企业管理系"></el-option>
            <el-option label="金融学系" value="金融学系"></el-option>
            <el-option label="财务与投资管理系" value="财务与投资管理系"></el-option>
            <el-option label="经济与贸易系" value="经济与贸易系"></el-option>
            <el-option label="会计学系" value="会计学系"></el-option>
            <el-option label="市场营销系" value="市场营销系"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list()">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="show()">查看图表</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" @click="exportData()">数据导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="userId"
        label="工号"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="userName"
        align="center"
        label="教师姓名"
      ></el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="著作教材"
        align="center"
        label="著作教材"
      >
        <template slot-scope="scope">
          <span>{{scope.row.著作教材 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="中文论文"
        align="center"
        label="中文论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.中文论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="英文论文"
        align="center"
        label="英文论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.英文论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="获奖" align="center" label="获奖">
        <template slot-scope="scope">
          <span>{{scope.row.获奖 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="要报" align="center" label="要报">
        <template slot-scope="scope">
          <span>{{scope.row.要报 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="优秀博硕论文"
        align="center"
        label="优秀博硕论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.优秀博硕论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="科研项目"
        align="center"
        label="科研项目"
      >
        <template slot-scope="scope">
          <span>{{scope.row.科研项目 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="scores"
        align="center"
        label="合计"
      ></el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" align="center" label="个人数据">
        <template slot-scope="scope">
          <el-button @click="operate='show';download(scope.row)" type="text" size="normal">下载</el-button>
          <el-button @click="operate='show';showData(scope.row)" type="text" size="normal">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="changeSize"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-drawer size="60%" style="min-height:500px" title="详情" :visible.sync="dialogDetailVisible">
      <Highcharts id="departmentStatistic" :option="statisticOption" />
    </el-drawer>
    <el-drawer
      size="60%"
      style="min-height:500px"
      title="个人数据详情"
      :visible.sync="teacherVisible"
      id="teacherDrawer"
      @closed="closedForm();"
    >
      <Highcharts id="teacherStatistic" :option="option" />
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
      teacherVisible: false,
      option: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "个人数据详情"
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: []
      },
      statisticOption: {
        credits: {
          enabled: false
        },
        chart: {
          panning: true,
          type: "column"
        },
        title: {
          text: "科研奖励统计系别对比"
        },

        subtitle: {
          text: ""
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          categories: [],
          gridLineWidth: 2,
          min: 0,
          max: 4
        },
        yAxis: {
          tickPixelInterval: 1,
          min: 0,
          title: {
            text: "计分",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        tooltip: {
          valueSuffix: " 计分"
        },
        plotOptions: {
          column: {
            pointWidth: 10 //柱子宽bai度du
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
  filters: {
    statusFilter: function(value) {
      if (value == undefined) {
        return 0;
      } else {
        return value;
      }
    }
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
  methods: {
    async show() {
      if (!this.query.year) {
        this.$message({
          type: "info",
          message: "请输入年份"
        });
        return;
      }
      this.dialogDetailVisible = true;
      await this.showDepartment();
      // await this.showTeacherData();
    },
    async showDepartment() {
      let param = {
        year: this.query.year,
        department: this.query.department
      };
      let res = await axios.$get("award/charts/department", param);
      let items = [];
      this.statisticOption.series = [];
      this.statisticOption.xAxis.categories = [];
      for (const key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          const element = res.data[key];
          this.statisticOption.xAxis.categories.push(key);
          items.push(element);
        }
      }
      let names = {
        articleCnScore: "中文论文",
        articleEnScore: "英文论文",
        awardResultScore: "获奖",
        excellentPapersScore: "优秀博硕论文",
        projectScore: "科研项目",
        reportResultScore: "要报",
        textBookScore: "著作教材"
      };
      for (const key in names) {
        if (names.hasOwnProperty(key)) {
          const element = names[key];
          let data = [];
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            data.push(item[key]);
            console.log(data[i] + "=====" + key);
          }
          this.statisticOption.series.push({
            name: element,
            data: data
          });
        }
      }
    },
    async showTeacherData() {
      if (!this.query.year) {
        this.$message({
          type: "info",
          message: "请输入年份"
        });
        return;
      }
      let param = {
        year: this.query.year,
        department: this.query.department,
        offset: 0,
        limit: 99999999
      };
      this.option.xAxis.categories = [];
      this.option.series = [];
      let res = await axios.$post("award/list", param);
      let items = [];
      console.log(typeof res.records);
      for (let i = 0; i < res.records.length; i++) {
        const element = res.records[i];
        this.option.xAxis.categories.push(element.userName);
        items.push(element.score);
      }
      let names = [
        "中文论文",
        "英文论文",
        "获奖",
        "优秀博硕论文",
        "科研项目",
        "要报",
        "著作教材"
      ];
      let data = [];
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        let data = [];
        for (let j = 0; j < items.length; j++) {
          const item = items[j];
          if (item[name]) {
            data.push(item[name][this.query.year].toFixed(4));
          } else {
            data.push(0);
          }
        }
        this.option.series.push({
          name: name,
          data: data
        });
      }
    },
    async exportData() {
      let data = "";
      let param = {
        year: this.query.year,
        userId: this.query.userId,
        department: this.query.department
      };
      data = await axios.$download("/award/export", param);
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-数据报表.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async download(row) {
      let data = "";
      let param = { year: this.query.year, userId: row.userId };
      data = await axios.$download("/award/info/export", param);
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-数据报表个人详细.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async showData(row) {
      this.option.series = [];
      console.log(this.option.series);
      let res = await axios.$get("award/statistics", { userId: row.userId });
      let currentYear = row.year;
      let data = [];
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const element = res[key];
          let point = "";
          if (element[currentYear] != undefined) {
            point = element[currentYear];
          } else {
            point = 0.0;
          }
          data.push({ name: key, y: point });
        }
      }
      this.option.series = [
        {
          name: "Brands",
          colorByPoint: true,
          data: data
        }
      ];
      console.log(JSON.stringify(this.option.series[0]));
      this.teacherVisible = true;
    },
    closedForm() {
      this.option.series = [];
    },

    async list() {
      let res = await axios.$post("award/list", this.query);
      for (let i = 0; i < res.records.length; i++) {
        res.records[i].scores = 0;
        res.records[i].year = this.query.year;
        for (const key in res.records[i].score) {
          if (res.records[i].score.hasOwnProperty(key)) {
            const element = res.records[i].score[key];
            res.records[i].scores += element[this.query.year];
            res.records[i][key] = res.records[i].score[key][
              this.query.year
            ].toFixed(4);
          }
        }
        res.records[i].scores = res.records[i].scores.toFixed(4);
      }
      this.total = parseInt(res.total);
      this.tableData = res.records;
      this.loading = false;
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
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