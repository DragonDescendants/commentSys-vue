<template>
  <!-- 评价列表 -->
  <div>
    <h2 style="text-align: center;">评价列表</h2>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
      <div v-if="comments.data.length > 0" v-for="(comment, index) in comments.data">
        <comment :comment="comment" :onClick="showReplys" :index="index">
          <template #header>
            <span
              style="font-family: FangSong;font-weight: 800;"
            >{{ comment.spuName }}&nbsp;{{ comment.skuName }}</span>
          </template>
        </comment>
      </div>
    </div>
    <!-- <el-divider></el-divider> -->
    <div class="flex-center">
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了...</p>
    </div>
  </div>
  <!-- 评价下的讨论抽屉 -->
  <el-drawer
    v-model="isCommentReplysShow"
    title="讨论都在这儿啦!"
    direction="rtl"
    size="30%"
    :before-close="handleRepliesClose"
    custom-class="right-replies"
  >
    <!-- {{comments.data[selectIndex]}} -->
    <div
      style="color: red;font-size: larger;margin-bottom: 10px;"
    >{{ selectIndex === -1 ? '' : comments.data[selectIndex].userName }}</div>
    <span
      style="font-size:large;font-weight: bold;"
    >{{ selectIndex === -1 ? '' : comments.data[selectIndex].text }}</span>
    <el-divider></el-divider>
    <!-- 普通用户才能讨论 -->
    <div
      v-if="store.userType === 0"
      style="display: flex;align-items: flex-end;flex-direction: column;"
    >
      <textarea
        v-model.trim="replyInputText"
        style="resize: none;width: 100%;height: 80px;"
        placeholder="在这里写下您想对这条评价说的话"
        maxlength="100"
      ></textarea>
      <span style="margin-top: 10px;"></span>
      <el-button style="width: 20%;" @click="replyComment()">提交</el-button>
    </div>
    <div v-if="selectIndex === -1 || comments.data[selectIndex].replies.length === 0">暂无人讨论</div>
    <div v-else v-for="(reply, index) in comments.data[selectIndex].replies">
      <!-- <span>{{ reply }}</span> -->
      <el-container style="padding-left: 0px;padding-right: 10px;">
        <el-aside width="60px">
          <el-avatar shape="circle" :size="60" fit="contain" :src="store.url + reply.userImg"></el-avatar>
        </el-aside>
        <el-main style="padding-top: 0px;padding-bottom: 0px;">
          <el-space style="margin-top: 10px;">
            <div style="color: red;font-size: medium;">{{ reply.userName }}</div>
            <div style="color: gray;font-size: small;">{{ reply.createTime }}</div>
          </el-space>
          <div style="font-size: medium;margin-top: 10px;font-weight: bold;">{{ reply.text }}</div>
        </el-main>
      </el-container>
      <!-- {{ comment }} -->
      <el-divider></el-divider>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRoute } from 'vue-router';
import http from '../../../api/api'
import { useStore } from '../../../store/store'
import Comment from '../../item/detail/comment/Comment.vue'

defineProps({
  msg: String
})

const route = useRoute()
const userId = route.query.id;

const store = useStore()

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)
const value = ref('')

const comments = reactive({
  data: []
})

const refresh = inject('refresh')
refresh(userId)


const getCommentsByUserId = () => {
  loading.value = true
  // level.value代表选定的星级，默认值0，即为全选
  http.get('/comment/user/' + userId, {
    params: {
      page: page.value + 1,
      size: size.value,
    }
  }).then((response) => {
    const code = response.data.code
    if (code === 200) {
      const result = response.data.data
      for (let i = 0, len = result.length; i < len; i++) {
        comments.data.push(result[i])
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
    getCommentsByUserId()
  }
}

const isCommentReplysShow = ref(false)
const selectIndex = ref(-1)
const replyInputText = ref('')

const showReplys = (index) => {
  isCommentReplysShow.value = true
  selectIndex.value = index
  // comment = comments.data[index]
}

const handleRepliesClose = (done) => {
  selectIndex.value = -1
  done()
}

const replyComment = () => {
  console.log('提交了')
  if (replyInputText.value === '') {
    ElMessage({
      message: '您还没有输入讨论内容',
      type: 'warning',
    })
    return;
  }
  http.post("/comment/reply", {
    commentId: comments.data[selectIndex.value].id,
    userId: store.userId,
    text: replyInputText.value
  }).then((response) => {
    if (response.data.code === 200) {
      // 提交完成后
      ElMessage({
        message: '您的讨论提交成功',
        type: 'success',
      })
      // 更新讨论数据
      //...
      comments.data[selectIndex.value].replies.push({
        id: response.data.data,
        userId: store.userId,
        userName: store.userName,
        userImg: store.image,
        commentId: comments.data[selectIndex.value].id,
        text: replyInputText.value,
        createTime: '最近',
        approval: 0,
        approvalUserIds: []
      })
      replyInputText.value = ''
    } else {
      ElMessage({
        message: '提交失败',
        type: 'error',
      })
    }
  }).catch(() => {
    ElMessage({
      message: '提交失败',
      type: 'error',
    })
  })
}
</script>

<style>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-replies {
  background-color: whitesmoke;
}
</style>