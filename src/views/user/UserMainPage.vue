<template>
  <div style="height: 100%;" class="full-width">
    <el-card>
      <div v-if="loading">加载中</div>
      <div v-else style="color: #409EFF;font-size: larger;font-weight: bold;">
        <div v-if="currentUser.id !== 0">
          <el-space>
            <el-avatar
              v-if="currentUser.img"
              :src="store.url + currentUser.img"
              :size="40"
              :icon="UserFilled"
            />
            <el-avatar v-else :size="40">暂无头像</el-avatar>
            <span>{{ currentUser.username }}</span>
            <span v-if="currentUser.id == currentUserId" style="color:orange">(我)</span>
          </el-space>
          <!-- 菜单 -->
          <el-menu router mode="horizontal" :default-active="rt.path">
            <el-menu-item
              index="/user/detail"
              :route="{ name: 'userDetail', query: { id: rt.query.id } }"
            >资料</el-menu-item>
            <el-menu-item
              index="/user/questions"
              :route="{ name: 'userQuesions', query: { id: rt.query.id } }"
            >提问</el-menu-item>
            <el-menu-item
              index="/user/answers"
              :route="{ name: 'userAnswers', query: { id: rt.query.id } }"
            >回答</el-menu-item>
            <el-menu-item
              index="/user/comments"
              :route="{ name: 'userComments', query: { id: rt.query.id } }"
            >评价</el-menu-item>
            <el-menu-item
              index="/user/discusses"
              :route="{ name: 'userDiscusses', query: { id: rt.query.id } }"
            >讨论</el-menu-item>
            <!-- <el-menu-item
              index="/user/detail"
              :route="{ name: 'userDetail', query: { id: rt.query.id } }"
            >...</el-menu-item>-->
          </el-menu>
        </div>
        <el-result v-else title="暂无此人的信息">
          <template #icon>
            <el-avatar shape="square" :size="300" src="/notFound.jpg" />
          </template>
        </el-result>
      </div>
    </el-card>
    <div v-show="currentUser.id !== 0" style="margin-top: 10px;">
      <!-- <el-divider></el-divider> -->
      <el-card>
        <router-view></router-view>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { provide, reactive, ref, onUpdated } from 'vue'
import { useStore } from '../../store/store'
import { useRoute } from 'vue-router'
import http from '../../api/api'

defineProps({
  msg: String
})

const store = useStore()
const rt = useRoute()
const currentUserId = store.userId
const loading = ref(false)

console.log(rt.path)

const currentUser = reactive({
  id: 0,
  username: '',
  img: ''
})

const getUserDetail = (id) => {
  if (id) {
    loading.value = true
    http.get('/user/detail/' + id).then((response) => {
      if (response.data.code === 200) {
        const result = response.data.data
        // user = result
        console.log(result)
        currentUser.id = result.id
        currentUser.username = result.username
        // user.mail = result.mail
        // user.phone = result.phone
        // user.name = result.name
        // user.sex = result.sex
        // user.age = result.age
        currentUser.img = result.img
        //...
        loading.value = false
      } else {
        loading.value = false
        // notFound.value = true
      }
    }).catch(() => {
      loading.value = false
    })
  }


}
//创建时加载一次
// getUserDetail(userId)
getUserDetail(rt.query.id)

const refresh = () => {
  // console.log('执行了一次刷新用户信息')
  // getUserDetail(id)
}
provide('refresh', refresh)

// onMounted(() => {
//   getUserDetail()
// })

onUpdated(() => {
  //更新时加载一次
  if (currentUser.id != rt.query.id)
    getUserDetail(rt.query.id)
})
</script>

<style>
/* .full-width {
  min-width: 1000px;
} */
</style>