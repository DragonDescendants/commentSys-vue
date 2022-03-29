<script setup>
import Main from './views/MainPage.vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <el-scrollbar>
      <Main></Main>
    </el-scrollbar>
  </el-config-provider>
</template>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  height: 100%;
  width: 100%;
}
.full-width {
  min-width: 1000px;
}
</style>
