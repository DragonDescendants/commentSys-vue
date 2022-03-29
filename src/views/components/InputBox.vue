<template>
  <el-space class="inputBox-container">
    <!-- 当前用户自己的头像 -->
    <el-avatar shape="circle" :size="75" fit="contain" :src="imageUrl"></el-avatar>

    <el-input
      v-model.trim="inputText"
      maxlength="100"
      :placeholder="inputPlaceholder"
      show-word-limit
      type="textarea"
      :rows="4"
      :style="inputStyle"
    />

    <!-- style="width: 100px;height: 100px;" -->
    <el-button type="primary" @click="submit" class="submit-button">{{ buttonText }}</el-button>
  </el-space>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // imageSize: {
  //   type: Number,
  //   default: 100
  // },
  inputSize: {
    type: Number,
    default: 500
  },
  inputPlaceholder: {
    type: String,
    default: '请输入您的问题'
  },
  imageUrl: {
    type: String
  },
  buttonText: {
    type: String,
    default: '向买家提问'
  },
  submit: {
    type: Function,
    require: true
  }
})

const inputText = ref('')
const inputStyle = ref('width:' + props.inputSize + 'px;')

const submit = () => {
  props.submit(inputText.value)
  // console.log('提交完毕,结果为:' + flag)
}
// 清空输入框的值
const clean = () => {
  console.log('调用了clean方法')
  inputText.value = ''
}
//clean方法暴露出去
defineExpose({
  clean
})

</script>

<style>
.submit-button {
  height: 75px;
}
/* .inputBox-container {
  padding-left: 125px;
} */
</style>