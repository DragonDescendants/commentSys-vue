<template>
    <div class="message-container full-width">
        <el-container style="height: 100%;">
            <el-aside width="150px" class="message-container-aside">
                <div style="padding: 10px;">
                    <el-space direction="vertical" :fill="true">
                        <div class="aside-menu-item">
                            <el-button
                                type="text"
                                style="margin-top: 15px;"
                                @click="toMessageChildPage('userQuestionMessages')"
                            >
                                <span
                                    class="aside-font"
                                    :class="{ active: route.path == '/messages/question' }"
                                >● 回答我的</span>
                            </el-button>
                        </div>
                        <div class="aside-menu-item">
                            <el-button
                                type="text"
                                style="margin-top: 15px;"
                                @click="toMessageChildPage('userAnswerMessages')"
                            >
                                <span
                                    class="aside-font"
                                    :class="{ active: route.path == '/messages/answer' }"
                                >● 回复我的</span>
                            </el-button>
                        </div>
                        <div class="aside-menu-item">
                            <el-button
                                type="text"
                                style="margin-top: 15px;"
                                @click="toMessageChildPage('userCommentMessages')"
                            >
                                <span
                                    class="aside-font"
                                    :class="{ active: route.path == '/messages/comment' }"
                                >● 讨论我的</span>
                            </el-button>
                        </div>
                        <div class="aside-menu-item">
                            <el-button type="text" style="margin-top: 15px;" disabled>
                                <span class="aside-font">● 神秘按钮</span>
                            </el-button>
                        </div>
                    </el-space>
                </div>
            </el-aside>
            <el-main
                style="--el-main-padding: 0px;height:100%;display: flex;flex-direction: column;"
            >
                <el-card class="main-card" style="display:block;z-index: 11;">
                    <div v-if="route.path == '/messages/question'">回答我的</div>
                    <div v-if="route.path == '/messages/answer'">回复我的</div>
                    <div v-if="route.path == '/messages/comment'">讨论我的</div>
                </el-card>
                <el-card class="main-card main-card-body">
                    <!-- <div v-for="o in 400" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
                    <router-view></router-view>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

defineProps({
    msg: String
})

const count = ref(0)

const toMessageChildPage = (name) => {
    router.push({ name: name })
}
</script>

<style scoped>
.message-container {
    height: 99.5%;
    /* background-color: aliceblue; */
    border: 1px solid whitesmoke;
    border-radius: 0.5rem;
    /* 设置颜色透明 */
    background: transparent;
    /* 设置颜色和透明度 */
    background-color: rgba(255, 255, 255, 0.5);
}
.message-container-aside {
    /* border-right: 1px solid; */
    background-color: rgba(255, 255, 255, 0.8);
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}
.aside-menu-item {
    margin-left: 10px;
}
.aside-font {
    font-size: larger;
    font-weight: bolder;
}
.main-card {
    margin: 5px;
}
.main-card-body {
    position: relative;
    flex: 1;
    overflow: auto;
}
.main-card-body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.main-card-body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
}
.main-card-body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
}
.active {
    color: red;
}
</style>