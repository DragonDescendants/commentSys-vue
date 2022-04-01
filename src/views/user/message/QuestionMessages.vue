<template>
    <div>
        <h2 style="text-align: center;">回答我的</h2>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
            <div v-if="answers.data.length > 0" v-for="(answer, index) in answers.data">
                <el-card shadow="never" style="margin-bottom: 10px;">
                    <answer :answer="answer">
                        <template #header>
                            <div>
                                <!-- 回答了&nbsp; -->
                                <el-link
                                    :underline="false"
                                    type="danger"
                                    @click="toItemDetail(answer.spuId)"
                                >
                                    <span
                                        style="font-family: FangSong;font-size: large;font-weight: 800;"
                                    >{{ answer.spuName }}</span>
                                </el-link>&nbsp;中
                                <span
                                    style="color: blue;"
                                >&nbsp;{{ store.userName }}(我)&nbsp;</span>的问题
                                <el-link
                                    :underline="false"
                                    type="danger"
                                    @click="toQuestionDetail(answer.questionId)"
                                >
                                    <span
                                        v-if="answer.questionText.length < 25"
                                    >{{ answer.questionText }}</span>
                                    <span
                                        v-if="answer.questionText.length >= 25"
                                    >{{ answer.questionText.substr(0, 25) + "..." }}</span>
                                </el-link>
                            </div>
                        </template>
                    </answer>
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
import Answer from '../../question/answer/Answer.vue';

defineProps({
    msg: String
})

const store = useStore()
const router = useRouter()

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)

const answers = reactive({
    data: []
})

const getMessagesByUserId = () => {
    http.get('/user/answer/to/' + store.userId, {
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