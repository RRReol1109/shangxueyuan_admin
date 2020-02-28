<template>
  <p :id="id" :option="option"></p>
</template>

<script>
import Highcharts from "highcharts";
export default {
  name: "Highcharts",
  props: {
    id: { type: String },
    option: { type: Object }
  },
  mounted() {
    Highcharts.chart(this.id, this.option);
  },
  watch: {
    "option.xAxis.categories": function(a, b) {
      Highcharts.chart(this.id, this.option);
      console.log(a, "=======a");
    }
  }
};
</script>

<style scoped>
</style>
