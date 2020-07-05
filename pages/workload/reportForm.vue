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
              :value="item.id"
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
        :show-overflow-tooltip="true"
        prop="userId"
        label="ID"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="教师姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="指导论文" align="center" label="论文指导">
        <template slot-scope="scope">
          <span>{{scope.row.指导论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="指导研究生" align="center" label="研究生指导">
        <template slot-scope="scope">
          <span>{{scope.row.指导研究生 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="课堂教学" align="center" label="课堂教学">
        <template slot-scope="scope">
          <span>{{scope.row.课堂教学 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="实习" align="center" label="实习">
        <template slot-scope="scope">
          <span>{{scope.row.实习 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="沙盘模拟" align="center" label="沙盘模拟">
        <template slot-scope="scope">
          <span>{{scope.row.沙盘模拟 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="社会调查" align="center" label="社会调查">
        <template slot-scope="scope">
          <span>{{scope.row.社会调查 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="scores" align="center" label="合计"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="个人数据">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer size="60%" style="min-height:500px" title="详情" :visible.sync="dialogDetailVisible">
      <!-- <Highcharts id="teacherStatistic" :option="option" /> -->
      <Highcharts id="departmentStatistic" :option="statisticOption" />
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
          panning: true,
          type: "column"
        },
        title: {
          text: "工作量分类统计教师个人对比"
        },

        subtitle: {
          text: ""
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          categories: ["吴平", "王舞", "张三", "赵刚", "施文"],
          gridLineWidth: 2,
          min: 0,
          max: 4
        },
        yAxis: {
          tickPixelInterval: 1,
          min: 0,
          title: {
            text: "工作量",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        tooltip: {
          valueSuffix: " 工作量"
        },
        plotOptions: {
          column: {
            pointWidth: 10 //柱子宽bai度du
          }
        },
        series: [
          {
            name: "论文指导",
            data: [107, 131, 135, 203, 152]
          },
          {
            name: "研究生指导",
            data: [133, 156, 147, 208, 196]
          },
          {
            name: "课堂教学",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "实习",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "沙盘模拟",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "社会调查",
            data: [173, 114, 154, 132, 134]
          }
        ]
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
          text: "工作量分类统计系别对比"
        },

        subtitle: {
          text: ""
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          categories: [
            // "管理科学与信息管理系",
            // "企业管理系",
            // "金融学系",
            // "财务与投资管理系",
            // "经济与贸易系",
            // "会计学系",
            // "市场营销系"
          ],
          gridLineWidth: 2,
          min: 0,
          max: 4
        },
        yAxis: {
          tickPixelInterval: 1,
          min: 0,
          title: {
            text: "工作量",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        tooltip: {
          valueSuffix: " 工作量"
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
      this.dialogDetailVisible = true;
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
      console.log(items);
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
    async showDialog(row) {
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
    async list() {
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
        res.records[i].scores = res.records[i].scores.toFixed(2);
      }
      this.total = parseInt(res.total);
      this.tableData = res.records;
      this.loading = false;
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