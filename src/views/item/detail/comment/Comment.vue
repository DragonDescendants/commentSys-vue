<template>
  <el-card style="margin: 5px;" shadow="never">
    <el-container style="padding-left: 0px;padding-right: 10px;">
      <el-aside width="60px" v-if="comment.userImg">
        <el-avatar shape="circle" :size="60" fit="contain" :src="store.url + comment.userImg"></el-avatar>
      </el-aside>
      <el-main style="padding-top: 0px;padding-bottom: 0px;">
        <slot name="header"></slot>
        <div style="color: red;font-size: medium;">{{ comment.userName }}</div>
        <el-rate
          v-model="comment.level"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        ></el-rate>

        <div style="font-size: large;margin-top: 10px;font-weight: bolder;">{{ comment.text }}</div>

        <el-space style="margin-top: 10px;">
          <slot></slot>
          <div style="color: gray;font-size: small;">{{ comment.createTime }}</div>

          <el-button type="text" @click="onClick(index)">讨论</el-button>

          <span v-if="!isStar" @click="starChecked">
            <el-icon>
              <star />
            </el-icon>
            <span class="answer-footer">{{ starCount }}</span>
          </span>
          <span v-else @click="starChecked">
            <el-icon>
              <star-filled />
            </el-icon>
            <span class="answer-footer">{{ starCount }}</span>
          </span>
        </el-space>
        <div v-if="comment.tags">
          <!-- 是管理员 -->
          <div v-if="store.userType === 1">
            <span v-if="tagArray.length !== 0">已有标签：</span>
            <el-tag v-for="(item, index) in tagArray" class="mx-1" effect="plain">{{ item }}</el-tag>
          </div>
          <!-- 是普通用户 -->
          <div v-else-if="store.userType === 0">
            <el-tag v-for="(item, index) in tagArray" class="mx-1" effect="plain">{{ item }}</el-tag>
          </div>
        </div>
        <div v-else>
          <!-- 暂无标签 -->
        </div>
        <div v-if="store.userType === 1">
          <div v-if="preTagArray.length !== 0">
            <span>备选标签：</span>
            <el-tag
              v-for="(item, index) in preTagArray"
              class="mx-1"
              effect="plain"
              closable
              @close="handleTagClose(item, index)"
            >{{ item }}</el-tag>
            <el-button size="small" @click="commitPreLabel">通过</el-button>
          </div>
          <div v-else>暂无备选标签</div>
        </div>
      </el-main>
    </el-container>
    <!-- {{comment}} -->
    <el-space>
      <el-image
        v-for="(image, index) in imageArray"
        style="width: 150px; height: 150px"
        :src="image"
        :preview-src-list="imageArray"
        :initial-index="index"
        fit="cover"
      ></el-image>
    </el-space>
  </el-card>
  <!-- {{ comment }} -->
  <!-- <el-divider></el-divider> -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../../../store/store';
import { Star, StarFilled } from '@element-plus/icons-vue'
import http from '../../../../api/api';
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  comment: Object,
  onClick: Function,
  index: Number
})

const store = useStore()

const isStar = ref(false)
const temp = ref(0)
const starCount = computed(() => {
  return props.comment.approvalUserIds.length + temp.value
})
if (props.comment.approvalUserIds.indexOf(store.userId) > -1) {
  isStar.value = true
}
// 点击了点赞按钮
const starChecked = () => {
  // 普通用户才能点
  if (store.userType !== 0) {
    return;
  }
  // 这时候应该向后端发送请求,参数为回答id,用户id
  // 即谁对哪个问题点了赞
  http.post('/comment/approval', {
    commentId: props.comment.id,
    userId: store.userId
  }).then((response) => {
    if (response.data.code === 200) {
      isStar.value = !isStar.value
      //length应该加一才对
      if (isStar.value === false) {
        temp.value--
      } else {
        temp.value++
      }
    } else {
      ElMessage({
        message: "您操作的太频繁了",
        type: "warning",
      })
    }
  }).catch((error) => {
    ElMessage({
      message: "您操作的太频繁了",
      type: "warning",
    })
  })
}

const imageArray = ref([])
const setImageArray = () => {
  if (props.comment.images) {
    imageArray.value = props.comment.images.split(",")
    for (let i = 0, len = imageArray.value.length; i < len; i++) {
      imageArray.value[i] = store.url + imageArray.value[i]
    }
  }
}
setImageArray()

const tagArray = ref([])
const setTagArray = () => {
  if (props.comment.tags) {
    tagArray.value = props.comment.tags.split(",")
  }
}
setTagArray()

const preTagArray = ref([])
const setPreTagArray = () => {
  if (props.comment.preTags) {
    preTagArray.value = props.comment.preTags.split(",")
  }
}
setPreTagArray()

const handleTagClose = (tag, index) => {
  ElMessageBox.confirm(
    '确定要从备选标签中删除"' + tag + '"嘛?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '手滑了',
      type: 'warning',
    }
  )
    .then(() => {
      console.log('删除', tag, index)
      preTagArray.value.splice(index, 1)
    })
    .catch(() => {
      console.log('未删除', tag, index)
    })
  // console.log(tag, index)
}

const commitPreLabel = () => {
  ElMessageBox.confirm(
    '确定要通过这些备选标签吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '手滑了',
      type: 'warning',
    }
  )
    .then(() => {
      for (let tag of preTagArray.value) {
        tagArray.value.push(tag)
      }
      preTagArray.value = []
      //发个请求改一下标签
      //...
      let pathString = ''
      if (tagArray.value.length !== 0) {
        pathString = tagArray.value.join(',')
        console.log(pathString)
      }
      http.put('/admin/comment/label', {
        commentId: props.comment.id,
        text: pathString
      }).then((response) => {
        if (response.data.code === 200) {
          ElMessage({
            message: "修改成功",
            type: "success"
          })
        } else {
          ElMessage({
            message: "您操作的太频繁了",
            type: "warning",
          })
        }
      }).catch((error) => {
        ElMessage({
          message: "您操作的太频繁了",
          type: "warning",
        })
      })
    })
    .catch(() => {
      console.log('未通过')
    })
}
</script>