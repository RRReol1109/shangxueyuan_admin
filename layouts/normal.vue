<template>
  <el-row :gutter="0">
    <Head></Head>
    <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
      <Menu></Menu>
    </el-col>
    <el-col :xs="24" :sm="16" :md="18" :lg="20" :xl="21">
      <div class="main">
        <router-view></router-view>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Menu from "~/components/menu";
import Head from "~/components/Head";
export default {
  // middleware: 'auth',
  components: {
    Menu,
    Head
  },
  data() {
    return {};
  },
  mounted() {
    this.getMessage();
    window.addEventListener('unload', this.saveState);
  },
  methods: {
    saveState() {
      sessionStorage.setItem('vuex_state', JSON.stringify(this.$store.state))
    },
    getMessage() {
      if (localStorage.getItem("message")) {
        this.$store.commit("setToken", localStorage.getItem("message"));
      }
    }
  }
};
</script>
<style>
* {
  margin: 0px;
  padding: 0px;
}
html body {
  background: #fff;
  font-weight: bold;
  /* overflow: hidden; */
}
.main {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  height: 1000px;
  overflow-y: auto;
}
.main::-webkit-scrollbar {
  display: none;/*隐藏滚动条*/
}
.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 18px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
.el-checkbox__label {
  font-size: 16px;
}
html,body {
  height: 100%;
  width: 100%;
}
</style>

