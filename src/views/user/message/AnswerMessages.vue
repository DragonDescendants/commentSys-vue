<template>
  <div>
    <h2 style="text-align: center;">回复我的</h2>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
      <div v-if="replies.data.length > 0" v-for="(reply, index) in replies.data">
        <!-- {{ reply }} -->
        <el-card shadow="never" style="margin-bottom: 10px;">
          <AnswerReply :reply="reply" isMessagePage>
            <template #header>
              <div>
                在
                <el-link :underline="false" type="danger" @click="toItemDetail(reply.spuId)">
                  <span
                    style="font-family: FangSong;font-size: large;font-weight: 800;"
                  >{{ reply.spuName }}</span>
                </el-link>&nbsp;中&nbsp;我对问题
                <el-link
                  :underline="false"
                  type="danger"
                  @click="toQuestionDetail(reply.questionId)"
                >
                  <span v-if="reply.questionText.length < 25">{{ reply.questionText }}</span>
                  <span
                    v-if="reply.questionText.length >= 25"
                  >{{ reply.questionText.substr(0, 25) + "..." }}</span>
                </el-link>的回答
              </div>
              <div style="margin-top: 10px;">
                <!-- <el-link
                  :underline="false"
                  type="danger"
                  @click="toQuestionDetail(reply.currentAnswerId)"
                >-->
                <!-- </el-link> -->
                <span v-if="reply.currentAnswerText.length < 25">"{{ reply.currentAnswerText }}"</span>
                <span
                  v-if="reply.currentAnswerText.length >= 25"
                >"{{ reply.currentAnswerText.substr(0, 25) + "..." }}"</span>
                下
              </div>
            </template>
          </AnswerReply>
        </el-card>
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
import AnswerReply from '../../question/answer/AnswerReply.vue';

defineProps({
  msg: String
})

const store = useStore()
const router = useRouter()

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)

const replies = reactive({
  data: []
})

const getMessagesByUserId = () => {
  http.get('/user/reply/to/' + store.userId, {
    params: {
      page: page.value + 1,
      size: size.value,
    }
  }).then((response) => {
    const code = response.data.code
    if (code === 200) {
      const result = response.data.data
      for (let i = 0, len = result.length; i < len; i++) {
        replies.data.push(result[i])
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
    getMessagesByUserId()
  }
}

// load()

const toItemDetail = (spuId) => {
  router.push({ name: 'itemDetailInfo', query: { id: spuId } })
}

const toQuestionDetail = (questionId) => {
  router.push({ name: 'questionDetail', query: { id: questionId } })
}
</script>