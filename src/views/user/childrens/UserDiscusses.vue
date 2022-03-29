<template>
  <!-- 讨论列表 -->
  <div>
    <h2 style="text-align: left;">进行的讨论</h2>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
      <div v-if="discusses.data.length > 0" v-for="(discuss, index) in discusses.data">
        <!-- <transition name="el-fade-in-linear"> -->
        <!-- {{answer}} -->
        <div style="margin-bottom: 10px;">
          <el-space>
            <div
              style="font-size: small;font-family:'Times New Roman', Times, serif;"
            >于&nbsp;{{ discuss.createTime }}</div>
            <div>
              对&nbsp;
              <el-link
                :underline="false"
                type="danger"
                @click="toUserDetail(discuss.userId)"
              >{{ discuss.userName }}</el-link>&nbsp;的评价
              <el-link :underline="false" type="danger" @click="toSpuCommentDetail(discuss.spuId)">
                <span v-if="discuss.commentText.length < 25">{{ discuss.commentText }}</span>
                <span
                  v-if="discuss.commentText.length >= 25"
                >{{ discuss.commentText.substr(0, 25) + "..." }}</span>
              </el-link>&nbsp;说
            </div>
            <div style="font-weight: bolder;font-size: larger;">{{ discuss.text }}</div>
          </el-space>
        </div>
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
import { ref, inject, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import http from '../../../api/api'

defineProps({
  msg: String
})

const rt = useRoute()
// 从路由中取出当前详情页所属用户的id
const id = rt.query.id

const refresh = inject('refresh')
refresh(id)

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)
const router = useRouter()

const discusses = reactive({
  data: []
})

const getDiscussesByUserId = () => {
  loading.value = true
  // level.value代表选定的星级，默认值0，即为全选
  http.get('/user/discuss/' + rt.query.id, {
    params: {
      page: page.value + 1,
      size: size.value,
    }
  }).then((response) => {
    const code = response.data.code
    if (code === 200) {
      const result = response.data.data
      for (let i = 0, len = result.length; i < len; i++) {
        discusses.data.push(result[i])
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

// 无限滚动load评价
const load = () => {
  if (noMore.value === false && loading.value === false) {
    console.log('去请求新数据了')
    getDiscussesByUserId()
  }
}

const toSpuCommentDetail = (spuId) => {
  router.push({ name: 'itemDetailCom', query: { id: spuId } })
}

const toUserDetail = (userId) => {
  router.push({ name: 'userDetail', query: { id: userId } })
}

</script>