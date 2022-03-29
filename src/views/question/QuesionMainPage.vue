<template>
    <div style="height: 100%;" class="full-width">
        <el-card>
            <el-affix position="top" :offset="110" :z-index="50">
                <el-card shadow="never">
                    <div style="display: flex;">
                        <el-button type="primary" :icon="Back" @click="router.go(-1)" circle></el-button>
                        <el-space direction="vertical" :fill="true">
                            <!-- <h2>{{ id }} {{ question }}问题详情</h2> -->
                            <el-container style="padding-left: 20px;padding-right: 20px;">
                                <el-aside width="60px">
                                    <el-avatar
                                        shape="circle"
                                        :size="60"
                                        fit="contain"
                                        :src="store.url + question.userImg"
                                    ></el-avatar>
                                </el-aside>
                                <el-main style="padding-top: 0px;padding-bottom: 0px;">
                                    <div
                                        style="color: red;font-size: medium;"
                                    >{{ question.userName }}</div>
                                    <div
                                        style="color: gray;font-size: small;margin-bottom: 10px;"
                                    >{{ question.createTime }}&nbsp;提问</div>
                                    <div
                                        style="font-size: large;margin-bottom: 10px;font-weight: bolder;"
                                    >{{ question.text }}</div>
                                    <div>
                                        <el-button type="text" @click="replyAnswer()">
                                            <span class="answer-footer">回答</span>
                                        </el-button>
                                    </div>
                                </el-main>
                            </el-container>
                        </el-space>
                    </div>
                    <div class="flex-center" v-if="store.userId !== 0">
                        <input-box
                            ref="childInputBox"
                            :inputPlaceholder="textareaText"
                            :imageUrl="store.url + store.image"
                            :buttonText="buttonText"
                            :submit="submit"
                        ></input-box>
                    </div>
                </el-card>
            </el-affix>
            <!-- <el-divider></el-divider> -->
            <div style="padding-left: 30px;">
                <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
                    <div v-for="(answer, index) in answers.data">
                        <div style="margin: 10px;">
                            <answer :answer="answer" :replyAnswer="replyAnswer"></answer>
                        </div>

                        <!-- <el-divider content-position="right">第{{ index + 1 }}个回答</el-divider> -->
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="flex-center">
                    <p v-if="loading">加载中...</p>
                    <p v-if="noMore">没有更多了...</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import http from '../../api/api';
import { useStore } from '../../store/store';
import Answer from './answer/Answer.vue';
import InputBox from '../components/InputBox.vue'
import {
    Back
} from '@element-plus/icons-vue'

defineProps({
    msg: String
})

const store = useStore()
const rt = useRoute()
const id = rt.query.id

const router = useRouter()

const page = ref(0)
const size = ref(5)
const count = ref(0)
const loading = ref(false)
const noMore = computed(() => count.value <= page.value * size.value)

const question = reactive({
    id: '',
    userId: '',
    userName: '',
    userImg: '',
    spuId: '',
    spuName: '',
    text: '',
    createTime: '',
    answerCount: ''
})

const answers = reactive({
    data: []
})
// 根据questionId获取它的问题信息
const getQuesionById = () => {
    http.get('/question/' + id).then((response) => {
        if (response.data.code === 200) {
            const result = response.data.data
            question.id = result.id
            question.userId = result.userId
            question.userName = result.userName
            question.userImg = result.userImg
            question.spuId = result.spuId
            question.spuName = result.spuName
            question.text = result.text
            question.createTime = result.createTime
            question.answerCount = result.answerCount
            count.value = question.answerCount
        } else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
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

// 根据questionId获取它的回答
const getAnswersByQuesionId = () => {
    loading.value = true
    http.get('/question/' + id + '/answer', {
        params: {
            page: page.value + 1,
            size: size.value
        }
    }).then((response) => {
        if (response.data.code === 200) {
            const result = response.data.data
            console.log(result)
            for (let i = 0, len = result.length; i < len; i++) {

                answers.data.push(result[i])
            }
            // answers.data 
            page.value++
            loading.value = false
        } else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
            // 如果服务器出错,设置count等于0,触发计算属性noMore,禁用无限滚动框
            count.value = 0
            loading.value = false
        }
    }).catch((error) => {
        // 如果服务器出错,设置count等于0,触发计算属性noMore,禁用无限滚动框
        count.value = 0
        loading.value = false
    });
}
getQuesionById()
getAnswersByQuesionId()

const load = () => {
    if (noMore.value === false && loading.value === false) {
        console.log('去请求新数据了')
        getAnswersByQuesionId()
    }
}

const reload = () => {
    // 重置无限列表
    const num = (page.value - 1) * size.value
    for (let i = answers.data.length - 1, fin = num - 1; i > fin; i--) {
        answers.data.pop()
    }
    page.value--
    // answers.data = []
    // page.value = 0
    // noMore.value === false
    // loading.value === false
    getAnswersByQuesionId()
    // load()
}

const targetAnswerId = ref(0)
const currentAnswerId = ref(0)
const targetUserName = ref('')

const buttonText = computed(() => {
    if (targetUserName.value !== '') {
        return '提交回复'
    } else {
        return '提交回答'
    }
})
const textareaText = computed(() => {
    if (targetUserName.value !== '') {
        const name = targetUserName.value
        return '回复' + name + ':'
    } else {
        return '请输入您的回答:'
    }
})

const replyAnswer = (current_answerId, target_username, target_userId) => {
    // console.log('点击了回复' + answerId + ',' + name)

    if (target_userId) {
        targetAnswerId.value = target_userId
    } else {
        targetAnswerId.value = 0
    }
    if (current_answerId) {
        currentAnswerId.value = current_answerId
    } else {
        currentAnswerId.value = 0
    }
    if (target_username) {
        targetUserName.value = target_username
    } else {
        targetUserName.value = ''
    }

    // if (!name || !answerId) {
    //     console.log('name是空')
    //     targetReplyId.value = 0
    //     targetUserName.value = ''
    // } else if (answerId !== 0) {
    //     targetReplyId.value = answerId
    //     targetUserName.value = name
    // }

}

const childInputBox = ref()
// 需要userId,store中取
// 需要questionId,当前页面中有
// 需要targetUserId,如果是在回复中点击了回复,应该保存在页面中
const submit = (text) => {
    if (text !== '')
        http.post('/question/' + question.id + '/answer', {
            // 对哪一个SPU提问
            questionId: question.id,
            // 回答者的id
            userId: store.userId,
            //如果是回复,回复对象的用户id
            targetAnswerId: targetAnswerId.value,
            // 如果是回复,回复问题的问题id
            currentAnswerId: currentAnswerId.value,
            // 提问的内容
            text: text
        }).then((response) => {
            if (response.data.code === 200) {
                ElMessage({
                    message: '用户提问成功',
                    type: 'success',
                })
                // 给子组件发一个请求让他清空输入框
                childInputBox.value.clean()
                console.log("拿到的id" + response.data.data)
                // 成功后数据添加进原页面
                if (currentAnswerId.value === 0) {

                    if (noMore.value)
                        answers.data.push(
                            {
                                id: response.data.data,
                                userId: store.userId,
                                userName: store.userName,
                                userImg: store.image,
                                questionId: question.id,
                                currentAnswerId: currentAnswerId.value,
                                text: text,
                                createTime: "刚刚",
                                approval: 0,
                                approvalUserIds: [],
                                replies: []
                            }
                        )
                } else {
                    for (let i = 0; i < answers.data.length; i++) {
                        if (answers.data[i].id === currentAnswerId.value) {
                            if (targetAnswerId.value === 0) {
                                answers.data[i].replies.push({
                                    id: response.data.data,
                                    userId: store.userId,
                                    userName: store.userName,
                                    userImg: store.image,
                                    questionId: question.id,
                                    targetAnswerId: targetAnswerId.value,
                                    currentAnswerId: currentAnswerId.value,
                                    text: text,
                                    createTime: "刚刚",
                                    approval: 0,
                                    approvalUserIds: [],
                                    // replies: []
                                })
                            } else {
                                const reply = answers.data[i].replies.filter(reply => reply.id === targetAnswerId.value)
                                console.log(reply)
                                answers.data[i].replies.push({
                                    id: response.data.data,
                                    userId: store.userId,
                                    userName: store.userName,
                                    userImg: store.image,
                                    questionId: question.id,
                                    targetAnswerId: targetAnswerId.value,
                                    targetAnswerText:Array.isArray(reply) ? reply[0].text : reply.text,
                                    targetUserId: Array.isArray(reply) ? reply[0].userId : reply.userId,
                                    targetUserName: Array.isArray(reply) ? reply[0].userName : reply.userName,
                                    targetUserImg: Array.isArray(reply) ? reply[0].userImg : reply.userImg,
                                    currentAnswerId: currentAnswerId.value,
                                    text: text,
                                    createTime: "刚刚",
                                    approval: 0,
                                    approvalUserIds: [],
                                    // replies: []
                                })
                            }
                            break;
                        }
                    }
                }
                // reload()
            } else {
                console.log(response.data)
                ElMessage({
                    message: '出现问题了呢',
                    type: 'warning',
                })
            }
        });
    else ElMessage.error('还没有填写内容')
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