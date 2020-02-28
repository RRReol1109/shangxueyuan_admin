<template>  
  <div class="navMenu">
    <label v-for="navMenu in navMenus" v-bind:key="navMenu.id" >
      <nuxt-link :to="navMenu.entity.value + '#' + navMenu.entity.name" style="text-decoration:none;">
        <el-menu-item v-if="navMenu.childs == null && navMenu.entity && navMenu.entity.state === 'ENABLE'"
                      :key="navMenu.entity.name" :data="navMenu" :index="navMenu.entity.name" :route="navMenu.entity.value" router>
          <i :class="navMenu.entity.icon"></i>
          <span class="item" slot="title" v-text="navMenu.entity.alias"></span>
        </el-menu-item>
      </nuxt-link>
      <el-submenu v-if="navMenu.childs && navMenu.entity && navMenu.entity.state === 'ENABLE'" :default-active="currentIndex"
                  :key="navMenu.entity.name" :data="navMenu" :index="navMenu.entity.value">
        <template slot="title">
          <i :class="navMenu.entity.icon"></i>
          <span class="item" v-text="navMenu.entity.alias"></span>
        </template>
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    data() {
      return {
        currentIndex: '/workload/list'
      }
    },
    mounted() {
      this.currentIndex = this.$route.path;
    }
  }
</script>

<style scoped>
  .item {
    font-size: 16px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>