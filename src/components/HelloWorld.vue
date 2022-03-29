<script setup>
import axios from 'axios';
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)

const httptest = () => {
  axios.get('/user/detail', {
    params: {
      id: 4
    },
    headers: { Authorization: "26dbb07c-d3dc-46dc-9a03-d5374b6c952c0" }
  }).then(function (response) {
    // 处理成功情况
    const result = response.data
    if(result.code == 200)
    console.log(result.data);
    else console.log(result.message)
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>
  <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
  <el-button type="primary" @click="httptest">测试请求</el-button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
