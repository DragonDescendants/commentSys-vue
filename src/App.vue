<script setup>
import Main from './views/MainPage.vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
const locale = zhCn
</script>

<template>
  <!-- 配置本地化 -->
  <el-config-provider :locale="locale">
      <Main></Main>
  </el-config-provider>
</template>

<style>
#app {
  /* 配置字体 */
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  height: 100%;
  width: 100%;
}
.full-width {
  min-width: 1000px;
}
</style>
