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
            <el-option label="中文论文" value="2"></el-option>
            <el-option label="英文论文" value="3"></el-option>
            <el-option label="获奖" value="4"></el-option>
            <el-option label="要报" value="5"></el-option>
            <el-option label="优秀硕博论文" value="6"></el-option>
            <el-option label="著作教材" value="7"></el-option>
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
      <el-table-column :show-overflow-tooltip="true" prop="著作教材" align="center" label="著作教材"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="中文论文" align="center" label="中文论文"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="英文论文" align="center" label="英文论文"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="获奖" align="center" label="获奖"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="要报" align="center" label="要报"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="优秀硕博论文" align="center" label="优秀硕博论文"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="科研项目" align="center" label="科研项目"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="scores" align="center" label="合计"></el-table-column>
    </el-table>
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
          categories: [
            "管理科学与信息管理系",
            "企业管理系",
            "金融学系",
            "财务与投资管理系",
            "经济与贸易系",
            "会计学系",
            "市场营销系"
          ],
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
            data: [107, 131, 135, 203, 152, 114, 154]
          },
          {
            name: "中文论文",
            data: [133, 156, 147, 208, 196, 114, 154]
          },
          {
            name: "英文论文",
            data: [173, 114, 154, 132, 134, 114, 154]
          },
          {
            name: "获奖",
            data: [173, 114, 154, 132, 134, 114, 154]
          },
          {
            name: "要报",
            data: [173, 114, 154, 132, 134, 114, 154]
          },
          {
            name: "优秀硕博论文",
            data: [173, 114, 154, 132, 134, 114, 154]
          },
          {
            name: "科研项目",
            data: [173, 114, 154, 132, 134, 173, 114]
          }
        ]
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
  methods: {
    show() {
      this.dialogDetailVisible = true;
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