<template>
    <div style="height: 100%;" class="full-width">
        <el-card style="min-height: 99.5%;">
            <!-- <el-affix :offset="106.4" :z-index="75">
                <el-card shadow="never"> -->
                    <el-row class="detail-header">
                        <el-col :span="9"></el-col>
                        <el-col :span="3">
                            <el-button type="text" @click="goItemInfo(id)">
                                <span class="detail-header-font">详情</span>
                            </el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="text" @click="goItemQuestion(id)">
                                <span class="detail-header-font">问答</span>
                            </el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="text" @click="goItemComment(id)">
                                <span class="detail-header-font">评价</span>
                            </el-button>
                        </el-col>
                        <el-col :span="6"></el-col>
                    </el-row>

                    <div class="detail-item-header">
                        <div v-if="loading">加载中</div>
                        <div v-else>
                            <el-breadcrumb :separator-icon="ArrowRight">
                                <el-breadcrumb-item>
                                    <span class="page-header-font">{{ result.cname1 }}</span>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <span class="page-header-font">{{ result.cname2 }}</span>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <span class="page-header-font">{{ result.cname3 }}</span>
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    <span
                                        class="page-header-font"
                                        style="color:brown;"
                                    >{{ result.title }}</span>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <!-- <el-page-header content="商品名称加载中" @back="goBack" v-if="loading" />
                        <el-page-header :content="result.title" @back="goBack" v-else />-->
                    </div>
                <!-- </el-card>
            </el-affix>
            <el-card shadow="never"> -->
                <router-view></router-view>
            <!-- </el-card> -->
        </el-card>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import getItemById from '../../../util/getItemName.js'
import { ArrowRight } from '@element-plus/icons-vue'

defineProps({

})

const rt = useRoute();
const id = rt.query.id
console.log(id)

const router = useRouter();

const goItemInfo = (id) => {
    console.log(id)
    router.push({ name: 'itemDetailInfo', query: { id: id } })
    // router.push({ path: '/detail/info', param: { id } });
}
const goItemQuestion = (id) => {
    router.push({ name: 'itemDetailQA', query: { id: id } })
}
const goItemComment = (id) => {
    router.push({ name: 'itemDetailCom', query: { id: id } })
}

const { loading, result } = getItemById('/item/detail/' + id)
console.log(result)
const goBack = () => {
    router.back();
}
</script>

<style scoped>
/* .item-detail-container{
    width: 800px;
} */
.detail-header {
    height: 40px;
}
.detail-header-font {
    margin-top: 5px;
    font-size: 20px;
    color: #303133;
}
.detail-item-header {
    margin-left: 2%;
    margin-top: 2%;
    margin-bottom: 15px;
}
/* .detail-body{
    
} */
.page-header-font {
    font-size: small;
    font-weight: bolder;
}
</style>