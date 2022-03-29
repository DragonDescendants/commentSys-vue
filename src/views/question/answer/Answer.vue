<template>
    <slot name="header"></slot>
    <div style="margin-top: 10px;"></div>
    <el-space warp>
        <el-avatar shape="circle" :size="40" fit="contain" :src="store.url + answer.userImg"></el-avatar>
        <div>
            <el-link type="primary">
                <span class="answer-text">{{ answer.userName }}</span>
                <span class="answer-text" v-show="answer.userId === store.userId">(我)</span>
            </el-link>
            <span
                class="answer-text"
                v-if="answer.targetAnswerId === 0 || !answer.targetAnswerId"
            >&nbsp;回答:&nbsp;</span>
            <span class="answer-text" v-else>
                回复
                <el-link type="primary">
                    <span class="answer-text">{{ answer.targetUserName }}</span>
                    <span class="answer-text" v-show="answer.targetUserId === store.userId">(我)</span>
                </el-link>
                <span v-if="answer.targetAnswerText.length < 6">&nbsp;({{ answer.targetAnswerText }})&nbsp;</span>
                  <span
                    v-if="answer.targetAnswerText.length >= 6"
                  >&nbsp;({{ answer.targetAnswerText.substr(0, 6) + "..." }})&nbsp;</span>
                :
            </span>
            <span style="font-weight: bold;">{{ answer.text }}</span>
        </div>
    </el-space>
    <div style="margin-left: 60px;">
        <el-space>
            <span class="answer-footer">{{ answer.createTime }}</span>
            <el-button
                v-if="replyAnswer"
                type="text"
                @click="replyAnswer(answer.id, answer.userName)"
            >
                <span class="answer-footer">回复</span>
            </el-button>
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
        <!-- {{ answer }} -->
    </div>
    <!-- 回复这个answer的 -->
    <div style="margin-left: 50px;" v-if="answer.replies">
        <!-- {{answer.replies}} -->
        <div v-if="answer.replies.length > 3">
            <AnswerReply :reply="answer.replies[0]" :replyAnswer="replyAnswer"></AnswerReply>
            <AnswerReply :reply="answer.replies[1]" :replyAnswer="replyAnswer"></AnswerReply>
            <AnswerReply :reply="answer.replies[2]" :replyAnswer="replyAnswer"></AnswerReply>
            <!-- <AnswerReply :reply="answer.replies[3]" :replyAnswer="replyAnswer"></AnswerReply>
            <AnswerReply :reply="answer.replies[4]" :replyAnswer="replyAnswer"></AnswerReply>-->
            <div v-if="showMore">
                <div v-for="(reply, index) in answer.replies.slice(3)">
                    <AnswerReply :reply="reply" :replyAnswer="replyAnswer"></AnswerReply>
                </div>
                <div class="flex-center">
                    <el-button type="text" @click="showMore = false">收起</el-button>
                </div>
            </div>
            <div v-else class="flex-center">
                <el-button type="text" @click="showMore = true">查看更多</el-button>
            </div>
        </div>
        <div v-else v-for="(reply, index) in answer.replies">
            <AnswerReply :reply="reply" :replyAnswer="replyAnswer"></AnswerReply>
        </div>
    </div>
    <slot name="footer"></slot>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useStore } from '../../../store/store';
import http from '../../../api/api';
import AnswerReply from './AnswerReply.vue'

const props = defineProps({
    answer: Object,
    replyAnswer: Function
})

const store = useStore()

const isStar = ref(false)
const temp = ref(0)
const starCount = computed(() => {
    return props.answer.approvalUserIds.length + temp.value
})
if (props.answer.approvalUserIds.indexOf(store.userId) > -1) {
    isStar.value = true
}

// 点击了点赞按钮
const starChecked = () => {
    // 这时候应该向后端发送请求,参数为回答id,用户id
    // 即谁对哪个问题点了赞
    http.post('/question/answer/approval', {
        replyId: props.answer.id,
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

const showMore = ref(false)

</script>

<style scoped>
.answer-text {
    font-size: medium;
}
.answer-footer {
    font-size: small;
}
</style>