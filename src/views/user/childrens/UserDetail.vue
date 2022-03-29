<template>
  <!-- <h2>这里是user的个人信息详情</h2>
  {{ user }}-->
  <!-- <div>..........</div> -->
  <div v-if="loading">资料加载中</div>
  <div v-else-if="notFound">
    <el-result title="暂无此人的信息">
      <template #icon>
        <el-avatar shape="square" :size="400" src="/notFound.jpg" />
      </template>
      <!-- <template #extra>
        <el-button type="primary">Back</el-button>
      </template>-->
    </el-result>
  </div>
 
  <div v-else>
      <h2 style="text-align: center;">个人资料</h2>
      <div v-if="rt.query.id == store.userId" style="display: flex;">
        <div style="display: flex;flex: 1;text-align: left;">
          <el-form label-position="left" label-width="100px" :model="user" style="width: 460px">
            <el-form-item label="姓名">
              <el-input v-model.trim="user.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <!-- <el-input v-model.trim="user.sex"></el-input> -->
              <el-radio-group v-model="user.sex">
                <el-radio :label="0">不愿意透露</el-radio>
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="...">...</el-form-item>
            <el-form-item label="...">...</el-form-item>
            <el-form-item label="...">...</el-form-item>
            <el-form-item label="年龄">
              <el-input v-model.number="user.age"></el-input>
              <!-- <el-input-number v-model="user.age" :min="1" :max="200" @change="handleChange" /> -->
              <!-- <el-input-number v-model="user.age" :min="1" :max="200"/> -->
            </el-form-item>
            <el-button type="primary" :disabled="!isChange" @click="resetChange">重置</el-button>
            <el-button type="primary" :disabled="!isChange" @click="updateUserDetail">提交</el-button>
          </el-form>
        </div>
        <div v-if="store.userId !== 0" style="display: flex; flex: 1;text-align: right;">
          <el-space direction="vertical" alignment="flex-start" style="margin-top: 10px;">
            <div style="font-size: small;">
              头像
              <el-button class="ml-3" type="success" @click="submitUpload">确认上传</el-button>
            </div>
            <el-upload
              :headers="headers"
              ref="uploadRef"
              class="avatar-uploader"
              action="http://localhost:8888/file/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              style="width: 100px;height: 100px;"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <plus />
              </el-icon>
            </el-upload>
          </el-space>
        </div>
      </div>
      <div v-else>这不是你！！！</div>
  </div>
 
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref, watch,inject } from 'vue'
import { useRoute } from 'vue-router';
import http from '../../../api/api';
import { useStore } from '../../../store/store'
import { Plus } from '@element-plus/icons-vue'
import Cookies from "js-cookie";

defineProps({
  msg: String
})

const store = useStore()
// 从路由中取出参数id
const rt = useRoute()
const id = rt.query.id
console.log(id)

const user = reactive({
  id: '',
  username: '',
  mail: '',
  phone: '',
  name: '',
  sex: '',
  age: '',
  img: ''
  //...
})

let result = ({
  id: '',
  username: '',
  mail: '',
  phone: '',
  name: '',
  sex: '',
  age: '',
  img: ''
  //...
})

const refresh = inject('refresh')
refresh(id)


const loading = ref(true)
const isChange = ref(false)
const notFound = ref(false)

// 图片的url
const imageUrl = ref('')
// 图片上传组件的ref
const uploadRef = ref()
// 图片上传请求的header
const headers = {
  Authorization: Cookies.get("token")
}
// 上传结束后的回调
const handleAvatarSuccess = (res, file) => {
  console.log(res)
  if (res !== 'failed') {
    http.put('/user/img', {
      id: store.userId,
      img: res
    }).then((response) => {
      if (response.data.code === 200) {
        ElMessage({
          message: "上传头像成功",
          type: "success",
        })
        store.setImage(res)
      }
    })
  }
  imageUrl.value = URL.createObjectURL(file.raw)
}
// 传输文件前的校验
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt1M = file.size / 1024 < 1024

  if (!isJPG) {
    ElMessage.error('Avatar picture must be JPG format!')
  }
  if (!isLt1M) {
    ElMessage.error('Avatar picture size can not exceed 1MB!')
  }
  return isJPG && isLt1M
}
// 上传请求的函数
const imageUpload = () => {

}
// 提交上传的函数
const submitUpload = () => {
  uploadRef.value.submit()
}

const count = ref(0)

const getUserDetail = () => {
  if (id)
    http.get('/user/detail/' + id).then((response) => {
      if (response.data.code === 200) {
        result = response.data.data
        // user = result
        console.log(result)
        user.id = result.id
        user.username = result.username
        user.mail = result.mail
        user.phone = result.phone
        user.name = result.name
        user.sex = result.sex
        user.age = result.age
        user.img = result.img
        //...
        loading.value = false

      } else {
        loading.value = false
        notFound.value = true
      }
    }).catch((error) => {
      loading.value = false
    })
}
//创建时加载一次
getUserDetail()

watch(() => user, (oldValue, newValue) => {
  if (loading.value === true) {
    isChange.value = false
  }
  else if (user.name !== result.name ||
    user.mail !== result.mail ||
    user.phone !== result.phone ||
    user.sex !== result.sex ||
    user.age !== result.age ||
    user.img !== result.img)
    isChange.value = true
  else {
    isChange.value = false
  }
}, {
  immediate: false, // 是否初始化立即执行一次, 默认是false
  deep: true // 是否是深度监视, 默认是false
})

const resetChange = () => {
  user.id = result.id
  user.username = result.username
  user.mail = result.mail
  user.phone = result.phone
  user.name = result.name
  user.sex = result.sex
  user.age = result.age
  user.img = result.img
  //...
  isChange.value = false
}

const updateUserDetail = () => {
  http.put('/user/detail', {
    id: user.id,
    name: user.name,
    sex: user.sex,
    age: user.age
    // img: user.img
  }).then((response) => {
    if (response.data.code === 200) {
      ElMessage({
        message: "修改个人资料成功",
        type: "success",
      })
      isChange.value = false
    } else {
      ElMessage({
        message: response.data.data,
        type: "warning",
      })
    }
  })
}


</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>