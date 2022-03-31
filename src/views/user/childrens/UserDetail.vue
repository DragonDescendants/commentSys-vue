<template>
  <!-- 加载中 -->
  <div v-if="loading">资料加载中</div>
  <!-- 加载完毕,未找到此人信息 -->
  <div v-else-if="notFound">
    <el-result title="暂无此人的信息">
      <template #icon>
        <el-avatar shape="square" :size="400" src="/notFound.jpg" />
      </template>
    </el-result>
  </div>
  <!-- 加载完毕 -->
  <div v-else>
    <h2 style="text-align: center;">个人资料</h2>
    <div v-if="rt.query.id == store.userId" style="display: flex;">
      <!-- 个人资料部分 -->
      <div style="display: flex;flex: 1;text-align: left;">
        <el-form label-position="left" label-width="100px" :model="user" style="width: 460px">
          <el-form-item label="姓名">
            <el-input v-model.trim="user.name"></el-input>
          </el-form-item>
          <el-form-item label="性别">
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
          </el-form-item>
          <el-button type="primary" :disabled="!isChange" @click="resetChange">重置</el-button>
          <el-button type="primary" :disabled="!isChange" @click="updateUserDetail">提交</el-button>
        </el-form>
      </div>
      <!-- 头像上传部分 -->
      <div v-if="store.userId !== 0" style="display: flex; flex: 1;flex-direction: column;">
        <div style="text-align: center;">
          <div style="font-size: medium;">头像</div>
          <el-tooltip effect="dark" placement="top" content="头像支持jpg/png/gif格式,大小应在1MB以内">
            <div style="margin-top: 20px;" @click="selectImage">
              <el-avatar v-if="fileShowUrl" :src="fileShowUrl" :size="200" />
              <el-avatar v-else :size="200">选择头像文件</el-avatar>
            </div>
          </el-tooltip>
          <input
            v-show="false"
            ref="uploadInput"
            type="file"
            class="dl-none"
            name="icon"
            @change="onImageFileChange"
          />
          <el-button
            type="primary"
            :disabled="!fileShowUrl"
            style="margin-top: 20px;"
            @click="uploadSubmit"
          >
            <span>上传</span>
          </el-button>
        </div>
      </div>
    </div>
    <div v-else>这不是你！！！</div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref, watch, inject } from 'vue'
import { useRoute } from 'vue-router';
import http from '../../../api/api';
import { useStore } from '../../../store/store'

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

/*--------------头像上传相关-------------------*/
// 存放file对象的数组
const fileObjectArray = ref(null)
const fileShowUrl = ref(null)
// 上传框的ref对象
const uploadInput = ref(null);
// 上传框放入了头像
const onImageFileChange = (e) => {
  const input = e.target;
  fileObjectArray.value = input.files;
  if (fileObjectArray.value) {
    const currentFile = fileObjectArray.value[0]
    const isImg = currentFile.type === 'image/jpeg' || currentFile.type === 'image/png' || currentFile.type === 'image/gif'
    const isLess1MB = currentFile.size / 1024 < 1024
    if (isImg && isLess1MB) {
      console.log(currentFile)
      const fileReader = new FileReader()
      fileReader.readAsDataURL(currentFile);
      fileReader.onload = () => {
        fileShowUrl.value = fileReader.result
      }
    } else {
      fileObjectArray.value = null
      ElMessage({
        type: "warning",
        message: "文件参数不合法,应为jpg/png/gif格式,且大小在1MB以内"
      })
      input.files = null
      input.value = null
    }
  }
}
//选择头像
const selectImage = () => {
  console.log(uploadInput.value)
  let oBtn = uploadInput.value;
  oBtn.click();
}
// 上传头像
const uploadSubmit = () => {
  if (fileObjectArray.value) {
    let formdata = new FormData()
    formdata.append('userId', store.userId)
    formdata.append('file', fileObjectArray.value[0])
    http.post('/file/userImg/upload', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      if (res.data.code === 200) {
        console.log("成功上传!")
        fileObjectArray.value = null
        ElMessage({
          type: "success",
          message: "用户头像已成功更改,请刷新"
        })
      } else {
        ElMessage({
          type: "error",
          message: "头像上传失败,请重试"
        })
      }
    })
  }
}
/* ---------------------------------------------- */

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
    }).catch(() => {
      loading.value = false
    })
}
//创建时加载一次
getUserDetail()

watch(() => user, () => {
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