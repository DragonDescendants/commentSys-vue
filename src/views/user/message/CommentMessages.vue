<template>
<div>
    <h2 style="text-align: center;">讨论我的</h2>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
      <div v-if="discussions.data.length > 0" v-for="(discussion, index) in discussions.data">
        <!-- {{ reply }} -->
        <span style="margin-bottom: 10px;">
          <discussion :discussion="discussion"></discussion>
        </span>
      </div>
      <div class="flex-center">
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import http from '../../../api/api';
import { useStore } from '../../../store/store';
import Discussion from '../../item/detail/comment/Discussion.vue'

defineProps({
  msg: String
})

const store = useStore()
const router = useRouter()

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)

const discussions = reactive({
  data: []
})

const getDiscussionsByUserId = () => {
  http.get('/user/discuss/to/' + store.userId, {
    params: {
      page: page.value + 1,
      size: size.value,
    }
  }).then((response) => {
    const code = response.data.code
    if (code === 200) {
      const result = response.data.data
      for (let i = 0, len = result.length; i < len; i++) {
        discussions.data.push(result[i])
      }
      page.value++
      loading.value = false
    } else if (code === 600) {
      // 已经没有更多了,禁用无限滚动框
      loading.value = false
      noMore.value = true
    }
    else {
      ElMessage({
        message: '出现问题了呢',
        type: 'warning',
      })
      // 如果服务器出错,禁用无限滚动框
      loading.value = false
      noMore.value = true
    }
  }).catch(() => {
    // 如果服务器出错,禁用无限滚动框
    loading.value = false
    noMore.value = true
  })
}

// 无限滚动load回答
const load = () => {
  if (noMore.value === false && loading.value === false) {
    console.log('去请求新数据了')
    getDiscussionsByUserId()
  }
}
</script>