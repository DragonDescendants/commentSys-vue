<template>
  <div>
    <div v-if="questions.data.length === 0">
      <el-empty v-if="id === store.userId" :image-size="400" description="您还没有对商品提过问题" />
      <el-empty v-else :image-size="400" description="该用户还没有对商品提过问题" />
    </div>

    <div v-show="questions.data.length !== 0">
      <h2 style="text-align: center;">提问列表</h2>
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
          <div v-for="(question, index) in questions.data">
            <el-collapse-item :name="question.id">
              <template #title>
                <div style="font-size: large;font-weight: 400;">
                  于&nbsp;{{ question.createTime }}&nbsp;对&nbsp;
                  <el-button
                    type="text"
                    @click="toItemDetail(question.spuId)"
                  >{{ question.spuName }}</el-button>&nbsp;提问&nbsp;
                </div>
              </template>
              <el-space direction="vertical" alignment="flex-start">
                <div style="font-size: larger;">提问内容:&nbsp;{{ question.text }}</div>
                <div v-if="question.answers instanceof Array && question.answers.length !== 0">
                  <div style="font-size: larger;">回答人数:&nbsp;{{ question.answerCount }}</div>
                </div>
                <div v-else style="font-size: larger;">暂无人回答</div>
                <div>
                  <el-button type="info" @click="toItemDetail(question.spuId)">
                    <span style="font-size: xx-small;">去商品详情页</span>
                  </el-button>
                  <el-button type="primary" @click="toQuestionDetail(question.id)">
                    <span style="font-size: xx-small;">查看问答详情页</span>
                  </el-button>
                </div>
                <!-- <div>{{ question }}</div> -->
              </el-space>
            </el-collapse-item>
          </div>
          <div class="flex-center">
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了...</p>
          </div>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import http from '../../../api/api';
import { useStore } from '../../../store/store';

const store = useStore()
const rt = useRoute()
// 从路由中取出当前详情页所属用户的id
const id = rt.query.id
const router = useRouter()
const activeNames = ref('0')
const handleChange = (val) => {
  console.log(val)
}

const page = ref(0)
const size = ref(10)
const count = ref(0)
const questions = reactive({
  data: []
})

defineProps({
  msg: String
})

const refresh = inject('refresh')
refresh(id)

const toItemDetail = (spuId) => {
  router.push({ name: 'itemDetailInfo', query: { id: spuId } })
}

const loading = ref(false)
const noMore = computed(() => count.value <= page.value * size.value)

// 请求每页数据
const getQuesionsByUserId = () => {
  loading.value = true
  http.get('/question/user/' + id, {
    params: {
      page: page.value + 1,
      size: size.value
    }
  }).then((response) => {
    if (response.data.code === 200) {
      const result = response.data.data
      console.log(result)
      for (let i = 0, len = result.length; i < len; i++) {
        questions.data.push(result[i])
      }
      // questions.data = result
      page.value++
      loading.value = false
    } else {
      // 如果服务器出错,设置count等于0,触发计算属性noMore,禁用无限滚动框
      count.value = 0
      loading.value = false
    }
  }).catch((error) => {
    // 如果服务器出错,设置count等于0,触发计算属性noMore,禁用无限滚动框
    count.value = 0
    loading.value = false
  })
}
// 获取总数
const getQuesionCountByUserId = (userId) => {
  http.get('/question/user/' + userId + '/count').then((response) => {
    if (response.data.code === 200) {
      const result = response.data.data
      console.log(result)
      count.value = result
    }
  })
}

getQuesionsByUserId()
getQuesionCountByUserId(id)

const load = () => {
  if (noMore.value === false && loading.value === false) {
    console.log('去请求新数据了')
    getQuesionsByUserId()
  }
}
const toQuestionDetail = (id) => {
  router.push({ name: 'questionDetail', query: { id: id } })
}

</script>

<style>
.el-textarea__inner {
  height: 75px;
  width: 100%;
  resize: none;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>