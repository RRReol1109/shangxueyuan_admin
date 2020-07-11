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
        :show-overflow-tooltip="true"
        prop="userId"
        label="ID"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="year" align="center" label="年份"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="教师姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="著作教材" align="center" label="著作教材">
        <template slot-scope="scope">
          <span>{{scope.row.著作教材 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="中文论文" align="center" label="中文论文">
        <template slot-scope="scope">
          <span>{{scope.row.中文论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="英文论文" align="center" label="英文论文">
        <template slot-scope="scope">
          <span>{{scope.row.英文论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="获奖" align="center" label="获奖">
        <template slot-scope="scope">
          <span>{{scope.row.获奖 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="要报" align="center" label="要报">
        <template slot-scope="scope">
          <span>{{scope.row.要报 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="优秀硕博论文" align="center" label="优秀硕博论文">
        <template slot-scope="scope">
          <span>{{scope.row.优秀硕博论文 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="科研项目" align="center" label="科研项目">
        <template slot-scope="scope">
          <span>{{scope.row.科研项目 | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="scores" align="center" label="合计"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="个人数据">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text" size="normal">查看</el-button>
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
      <Highcharts id="teacherStatistic" :option="option" />
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
          text: "科研奖励统计教师个人对比"
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
        series: [
          {
            name: "著作教材",
            data: [107, 131, 135, 203, 152]
          },
          {
            name: "中文论文",
            data: [133, 156, 147, 208, 196]
          },
          {
            name: "英文论文",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "获奖",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "要报",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "优秀硕博论文",
            data: [173, 114, 154, 132, 134]
          },
          {
            name: "科研项目",
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
      this.showDepartment();
      this.showTeacherData();
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
        excellentPapersScore: "优秀论文",
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
        "优秀论文",
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
    async showDialog(row) {
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
    async list() {
      let res = await axios.$post("award/list", this.query);
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