<template>
    <div style="display: flex; gap: 16px; flex-direction: column">
        <!-- {{currentUser}} -->
        <span class="card-body-text" style="color: #409EFF;">{{ store.userName }}</span>
        <div v-if="store.userId !== 0">
            <div v-if="store.userType === 0">
                <el-row justify="space-around">
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userDetail', store.userId)"
                        >
                            <span class="card-body-text">个人资料</span>
                        </el-card>
                    </el-col>
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="router.push({ name: 'userMessages' })"
                        >
                            <span class="card-body-text">消息中心</span>
                        </el-card>
                    </el-col>
                </el-row>
                <div style="margin-bottom: 10px;"></div>
                <el-row justify="space-around">
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userQuesions', store.userId)"
                        >
                            <span class="card-body-text">我的提问</span>
                        </el-card>
                    </el-col>
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userAnswers', store.userId)"
                        >
                            <span class="card-body-text">我的回答</span>
                        </el-card>
                    </el-col>
                </el-row>
                <div style="margin-bottom: 10px;"></div>
                <el-row justify="space-around">
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userComments', store.userId)"
                        >
                            <span class="card-body-text">我的评价</span>
                        </el-card>
                    </el-col>
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userDiscusses', store.userId)"
                        >
                            <span class="card-body-text">我的讨论</span>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- <el-row justify="space-around">
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userOrders', store.userId)"
                        >
                            <span class="card-body-text">我的订单</span>
                        </el-card>
                    </el-col>
                    <el-col :span="11">
                        <el-card
                            shadow="hover"
                            @click="toUserChildPage('userAttentions', store.userId)"
                        >
                            <span class="card-body-text">我的关注</span>
                        </el-card>
                    </el-col>
                </el-row> -->
                <el-button type="primary" style="width: 100%;margin-top: 20px;" @click="logout">退出登录</el-button>
            </div>
            <div v-else-if="store.userType === 1">
                <div style="text-align: center;">是商户管理员来了!</div> 
                <el-button type="primary" style="width: 100%;margin-top: 20px;" @click="logout">退出登录</el-button>
            </div>
        </div>
        <div v-else>
            <el-button type="primary" style="width: 100%;" @click="goLogin">立即登录</el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from '../../store/store';

defineProps({
    logout: Function
})

const store = useStore()
console.log(store.userId)


const router = useRouter();
const goLogin = () => {
    router.push('/login')
}

const toUserChildPage = (name, id) => {
    router.push({ name: name, query: { id: id } })
}

</script>

<style scoped>
.card-body-text {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    font-weight: bolder;
}
</style>