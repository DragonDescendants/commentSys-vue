<template>
    <el-card style="min-width: 1000px;border-radius: 0;">
        <div class="header-continer">
            <el-row class="row-bg">
                <el-col :span="2">
                    <img src="../../assets/logo.png" />
                </el-col>
                <el-col :span="4">
                    <el-space>
                        <el-icon color="#67C23A" :size="60" @click="back">
                            <caret-left />
                        </el-icon>
                        <el-icon color="#67C23A" :size="60" @click="forward">
                            <caret-right />
                        </el-icon>
                    </el-space>
                </el-col>
                <el-col :span="16">
                    <el-button type="text" @click="router.push('/home')" style="margin-top: 15px;">
                        <span class="header-font">首页</span>
                    </el-button>
                    <el-button type="text" style="margin-top: 15px;" disabled>
                        <span class="header-font">分类</span>
                    </el-button>
                    <el-button type="text" style="margin-top: 15px;" disabled>
                        <span class="header-font">神秘按钮</span>
                    </el-button>
                    <el-button type="text" style="margin-top: 15px;" disabled>
                        <span class="header-font">神秘按钮</span>
                    </el-button>
                    <!-- <router-link to="/detail">
                    <el-button type="text">
                        <span class="header-font">商品详情</span>
                    </el-button>
                </router-link>
                <router-link to="/user">
                    <el-button type="text">
                        <span class="header-font">个人中心</span>
                    </el-button>
                    </router-link>-->
                </el-col>
                <el-col :span="2">
                    <el-popover
                        :width="300"
                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                    >
                        <template #reference>
                            <el-avatar
                                v-if="store.userId !== 0 && store.image"
                                :src="store.url + store.image"
                                :size="60"
                                :icon="UserFilled"
                            />
                            <el-avatar v-else-if="store.userId !== 0" :size="60">暂无头像</el-avatar>
                            <el-avatar v-else :size="60">请登录</el-avatar>
                        </template>
                        <template #default>
                            <user-pannel :logout="logout"></user-pannel>
                        </template>
                    </el-popover>
                </el-col>
            </el-row>

            <div style="float: left;padding-left: 50px;">
                <div></div>
            </div>
            <!-- 右侧用户部分 -->
            <div style="float: right;padding-right: 50px;"></div>
        </div>
    </el-card>
    <!-- </div> -->
</template>

<script setup>
import { CaretLeft, CaretRight, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store/store';
import UserPannel from '../user/UserPannel.vue';

defineProps({
    logout: Function
})

const router = useRouter()
const store = useStore()

const back = () => {
    router.go(-1)
}

const forward = () => {
    router.go(1)
}
</script>

<style scoped>
img {
    width: 60px;
    height: 60px;
}
.header-font {
    font-size: 30px;
    font-weight: bolder;
}
.demo-border {
    height: 60px;
}
.header-continer {
    width: 1000px;
    margin-left: auto;
    margin-right: auto;
    /* margin-bottom: 10px; */
}
</style>