<template>
  <!-- 回答列表 -->
  <div>
    <h2 style="text-align: center;">回答列表</h2>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
      <div v-if="answers.data.length > 0" v-for="(answer, index) in answers.data">
        <!-- <transition name="el-fade-in-linear"> -->
        <!-- {{answer}} -->
        <el-card shadow="never" style="margin-bottom: 10px;">
          <answer :answer="answer">
            <template #header>
              <div>
                在&nbsp;
                <el-link :underline="false" type="danger" @click="toItemDetail(answer.spuId)">
                  <span
                    style="font-family: FangSong;font-size: large;font-weight: 800;"
                  >{{ answer.spuName }}</span>
                </el-link>&nbsp;中的问题
                <!-- &nbsp;{{answer}}的问题&nbsp; -->
                <el-link
                  :underline="false"
                  type="danger"
                  @click="toQuestionDetail(answer.questionId)"
                >
                  <span v-if="answer.questionText.length < 25">{{ answer.questionText }}</span>
                  <span
                    v-if="answer.questionText.length >= 25"
                  >{{ answer.questionText.substr(0, 25) + "..." }}</span>
                </el-link>&nbsp;下
              </div>
            </template>
          </answer>
        </el-card>
        <!-- </transition> -->
      </div>
    </div>
    <!-- <el-divider></el-divider> -->
    <div class="flex-center">
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import http from '../../../api/api'
import Answer from '../../question/answer/Answer.vue';

defineProps({
  msg: String
})

const route = useRoute()
const userId = route.query.id;


const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)
const router = useRouter()

const answers = reactive({
  data: []
})

const refresh = inject('refresh')
refresh(userId)


const getAnswersByUserId = () => {
  loading.value = true
  // level.value代表选定的星级，默认值0，即为全选
  http.get('/user/answer/' + userId, {
    params: {
      page: page.value + 1,
      size: size.value,
    }
  }).then((response) => {
    const code = response.data.code
    if (code === 200) {
      const result = response.data.data
      for (let i = 0, len = result.length; i < len; i++) {
        answers.data.push(result[i])
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
    getAnswersByUserId()
  }
}

const toItemDetail = (spuId) => {
  router.push({ name: 'itemDetailInfo', query: { id: spuId } })
}

const toQuestionDetail = (questionId) => {
  router.push({ name: 'questionDetail', query: { id: questionId } })
}
</script>