<template>
    <slot name="header"></slot>
    <div v-if="isMessage">
        <el-container style="padding-left: 0px;padding-right: 10px;">
            <el-aside width="60px">
                <el-avatar
                    shape="circle"
                    :size="60"
                    fit="contain"
                    :src="store.url + discussion.userImg"
                ></el-avatar>
            </el-aside>
            <el-main style="padding-top: 0px;padding-bottom: 0px;">
                <el-space style="margin-top: 10px;">
                    <div style="color: red;font-size: medium;">
                        {{ discussion.userName }}
                        <span
                            v-if="store.userName == discussion.userName"
                        >&nbsp;(我)&nbsp;</span>
                    </div>
                    <div style="color: gray;font-size: small;">{{ discussion.createTime }}</div>
                </el-space>
                <div
                    style="font-size: medium;margin-top: 10px;font-weight: bold;"
                >{{ discussion.text }}</div>
            </el-main>
        </el-container>
        <el-divider></el-divider>
    </div>
    <div v-else>
        <el-container style="padding-left: 0px;padding-right: 10px;">
            <el-aside width="60px">
                <el-avatar
                    shape="circle"
                    :size="60"
                    fit="contain"
                    :src="store.url + discussion.userImg"
                ></el-avatar>
            </el-aside>
            <el-main style="padding-top: 0px;padding-bottom: 0px;">
                <div style="display:flex;justify-content:flex-end">
                    <div style="flex: 1;">
                        <el-space style="margin-top: 10px;">
                            <div style="color: red;font-size: medium;">
                                {{ discussion.userName }}
                                <span
                                    v-if="store.userName == discussion.userName"
                                >&nbsp;(我)&nbsp;</span>
                            </div>
                            <div style="color: gray;font-size: small;">{{ discussion.createTime }}</div>
                        </el-space>
                        <div
                            style="font-size: medium;margin-top: 10px;font-weight: bold;"
                        >{{ discussion.text }}</div>
                    </div>
                    <div style="margin-right:10px;width: 150px;">
                        <div
                            style="text-align: center;font-size: small;font-family: FangSong;font-weight: bold;"
                        >
                            <el-link
                                :underline="false"
                                @click="toItemCommentPage(discussion.spuId)"
                            >
                                <span>{{ discussion.spuName }}-{{ discussion.skuName }}</span>
                            </el-link>
                        </div>
                        <div style="margin-top: 5px;font-size: smaller;">
                            <el-link
                                :underline="false"
                                @click="toItemCommentPage(discussion.spuId)"
                            >
                                <span
                                    v-if="discussion.commentText.length < 18"
                                >&nbsp;{{ discussion.commentText }}&nbsp;</span>
                                <span
                                    v-if="discussion.commentText.length >= 18"
                                >&nbsp;{{ discussion.commentText.substr(0, 18) + "..." }}&nbsp;</span>
                            </el-link>
                        </div>
                    </div>
                    <!-- <div style="width: 100px;font-size: smaller;">右半边2</div> -->
                </div>
            </el-main>
        </el-container>
        <el-divider></el-divider>
    </div>
    <slot name="footer"></slot>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '../../../../store/store';

defineProps({
    discussion: Object,
    isMessage: {
        type: Boolean,
        default: false
    }
})

const router = useRouter()
const store = useStore()

const toItemCommentPage = (spuId) => {
    router.push({ name: 'itemDetailCom', query: { id: spuId } })
}
</script>