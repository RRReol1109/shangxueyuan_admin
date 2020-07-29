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
          <el-select v-model="query.userId" filterable placeholder="请选择老师" prop style="width:98%">
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
            <el-option label="全部" value></el-option>
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
        prop="指导论文"
        align="center"
        label="论文指导"
      >
        <template slot-scope="scope">
          <span>{{scope.row.指导论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="指导研究生"
        align="center"
        label="研究生指导"
      >
        <template slot-scope="scope">
          <span>{{scope.row.指导研究生 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="课堂教学"
        align="center"
        label="课堂教学"
      >
        <template slot-scope="scope">
          <span>{{scope.row.课堂教学 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :show-overflow-tooltip="true" prop="实习" align="center" label="实习">
        <template slot-scope="scope">
          <span>{{scope.row.实习 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="沙盘模拟"
        align="center"
        label="沙盘模拟"
      >
        <template slot-scope="scope">
          <span>{{scope.row.沙盘模拟 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        prop="社会调查"
        align="center"
        label="社会调查"
      >
        <template slot-scope="scope">
          <span>{{scope.row.社会调查 | statusFilter}}</span>
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
      <Highcharts id="subjectStatistic" :option="subjectOption" />
    </el-drawer>
    <el-drawer
      size="60%"
      style="min-height:500px"
      title="个人数据详情"
      :visible.sync="teacherVisible"
      id="teacherDrawer"
    >
      <div id="main" :style="{width:'1100px', height: '500px'}" style="float: left;"></div>
    </el-drawer>
  </div>
</template>
<script>
import moment from "moment";
import echarts from "echarts";
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
      charts: "",
      loading: true,
      dialogDetailVisible: false,
      teacherVisible: false,
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
      option: {
        backgroundColor: "#FFFFFF",
        title: {
          text: "教师个人工作量统计",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "模块名称",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 274, name: "联盟广告" },
              { value: 235, name: "视频广告" },
              { value: 400, name: "搜索引擎" }
            ],
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)"
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: "#c23531",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      },
      subjectOption: {
        credits: {
          enabled: false
        },
        chart: {
          panning: true,
          type: "column"
        },
        title: {
          text: "科研奖励统计学科对比"
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
      await this.showTeacherData();
    },
    changeSize(val) {
      this.query.limit = val;
      this.list();
    },
    async showDepartment() {
      let param = {
        year: this.query.year,
        department: this.query.department
      };
      let res = await axios.$get("workload/charts/department", param);
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
        internshipScore: "实习",
        paperScore: "论文指导",
        postgraduateScore: "研究生指导",
        surveyScore: "社会调查",
        simulationScore: "沙盘模拟",
        teachingScore: "课堂教学"
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
      let res = await axios.$post("workload/list", param);
      let items = [];
      console.log(typeof res.records);
      for (let i = 0; i < res.records.length; i++) {
        const element = res.records[i];
        this.option.xAxis.categories.push(element.userName);
        items.push(element.score);
      }
      let names = [
        "指导研究生",
        "沙盘模拟",
        "实习",
        "社会调查",
        "课堂教学",
        "指导论文"
      ];
      let data = [];
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        let data = [];
        for (let j = 0; j < items.length; j++) {
          const item = items[j];
          if (item[name]) {
            data.push(item[name][this.query.year]);
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
      data = await axios.$download("/workload/export", param);
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作量-数据报表.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async download(row) {
      let data = "";
      let param = { year: this.query.year, userId: row.userId };
      data = await axios.$download("/workload/info/export", param);
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作量-数据报表个人详细.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async showData(row) {
      if (!this.query.year) {
        this.$message({
          type: "info",
          message: "请输入年份"
        });
        return;
      }
      this.teacherVisible = true;
      await this.showInfo(row);
    },
    async showInfo(row) {
      this.option.series[0].data = [];
      let res = await axios.$get("workload/statistics", { userId: row.userId });
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
          this.option.series[0].data.push({ value: point, name: key });
        }
      }
      // this.option.series.data = data;
      console.log(this.option.series);
      this.charts = echarts.init(document.getElementById("main"));
      this.charts.setOption(this.option);
    },
    async list() {
      if (!this.query.year) {
        this.$message({
          type: "info",
          message: "请输入年份"
        });
        return;
      }
      let res = await axios.$post("workload/list", this.query);
      for (let i = 0; i < res.records.length; i++) {
        res.records[i].scores = 0;
        res.records[i].year = this.query.year;
        for (const key in res.records[i].score) {
          if (res.records[i].score.hasOwnProperty(key)) {
            const element = res.records[i].score[key];
            res.records[i].scores += element[this.query.year];
            res.records[i][key] = res.records[i].score[key][this.query.year];
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