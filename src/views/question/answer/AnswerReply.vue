<template>
    <slot name="header"></slot>
    <div style="margin-top: 10px;"></div>
    <el-space warp>
        <el-avatar shape="circle" :size="30" fit="contain" :src="store.url + reply.userImg"></el-avatar>
        <div>
            <el-link type="primary">
                <span class="answer-text">{{ reply.userName }}</span>
                <span class="answer-text" v-show="reply.userId === store.userId">(我)</span>
            </el-link>
            <span class="answer-text">
                &nbsp;回复
                <el-link type="primary">
                    <span class="answer-text">{{ reply.targetUserName }}</span>
                    <span class="answer-text" v-show="reply.targetUserId === store.userId">(我)</span>
                </el-link>
                <span v-if="isMessagePage&&reply.targetAnswerText">
                    <span
                        v-if="reply.targetAnswerText.length < 6"
                    >&nbsp;({{ reply.targetAnswerText }})&nbsp;</span>
                    <span
                        v-if="reply.targetAnswerText.length >= 6"
                    >&nbsp;({{ reply.targetAnswerText.substr(0, 6) + "..." }})&nbsp;</span>
                </span>
            </span>
            :&nbsp;
            <span style="font-weight: bold;">{{ reply.text }}</span>
        </div>
    </el-space>
    <div style="margin-left: 60px;">
        <el-space>
            <span class="answer-footer">{{ reply.createTime }}</span>
            <el-button
                v-if="replyAnswer"
                type="text"
                @click="replyAnswer(reply.currentAnswerId, reply.userName, reply.id)"
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
    <slot name="footer"></slot>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useStore } from '../../../store/store';
import http from '../../../api/api';

const props = defineProps({
    reply: Object,
    replyAnswer: Function,
    isMessagePage: {
        type: Boolean,
        default: false
    },
})

const store = useStore()

const isStar = ref(false)
const temp = ref(0)
const starCount = computed(() => {
    return props.reply.approvalUserIds.length + temp.value
})
if (props.reply.approvalUserIds.indexOf(store.userId) > -1) {
    isStar.value = true
}

// 点击了点赞按钮
const starChecked = () => {
    // 这时候应该向后端发送请求,参数为回答id,用户id
    // 即谁对哪个问题点了赞
    http.post('/question/answer/approval', {
        replyId: props.reply.id,
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
</script>

<style scoped>
.answer-text {
    font-size: medium;
}
.answer-footer {
    font-size: small;
}
</style>