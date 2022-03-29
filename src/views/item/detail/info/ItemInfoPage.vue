<template>
    <div v-if="spu"></div>
    <div v-else>加载中</div>
    <!-- <el-divider></el-divider> -->
    <el-container>
        <el-aside width="302px">
            <el-carousel height="302px" style="width: 300px;border: 1px solid;">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </el-aside>
        <el-main style="--el-main-padding: 0;">
            <div style="margin-left: 15px;">
                <div style="font-size: 30px;font-weight: bolder;color: red;">{{ spu.title }}</div>
                <div style="font-size: smaller;margin-top: 5px;">{{ spu.subTitle }}</div>
                <el-divider style="margin: 5px 0;"></el-divider>
                <div v-if="spu.skus.length === 0">
                    <el-result>
                        <template #icon>
                            <el-avatar shape="square" :size="150" src="/notFind.gif" />
                            <div>商品准备中...</div>
                        </template>
                    </el-result>
                </div>
                <div v-else>
                    <div class="info-param">已选:{{ title }}</div>
                    <div class="info-param">
                        <el-space wrap>
                            <div v-for="(sku, index) in spu.skus">
                                <el-radio
                                    v-model="radio"
                                    :label="index"
                                    size="large"
                                    border
                                    @change="onRadioChange"
                                >{{ sku.title }}</el-radio>
                            </div>
                        </el-space>
                    </div>
                    <div class="info-param">价格:￥{{ price }}</div>
                    <div class="info-param">库存数量:{{ stock }}</div>
                </div>
            </div>
        </el-main>
    </el-container>
    <el-divider></el-divider>

    <el-descriptions title="商品详情">
        <el-descriptions-item label="品牌">{{ spu.brandName }}</el-descriptions-item>
        <div v-for="(value, key) in spu.specifications" :key="key">
            <el-descriptions-item :label="key">{{ value }}</el-descriptions-item>
        </div>
        <div v-for="(value, key) in ownSpecs" :key="key">
            <el-descriptions-item :label="key">{{ value }}</el-descriptions-item>
        </div>
        <!-- <el-descriptions-item label="Remarks">
            <el-tag size="small">School</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Address">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
            Province
        </el-descriptions-item>-->
    </el-descriptions>
    <!-- {{ spu }}
    <h2>haha</h2>
    {{ skuList }}-->
    <!-- <div>
        商品信息:
        <ul v-for="(value, key) in specifications" :key="key">
            <li>{{ key }}</li>
            <li>{{ value }}</li>
        </ul>
    </div>-->
    <!-- <button @click="test">测试按钮</button> -->

    <el-space :fill="true">
        <el-image v-for="url in urls" :key="url" :src="url" lazy></el-image>
    </el-space>
</template>

<script setup>
import { reactive, ref } from 'vue'
import http from '../../../../api/api';
import { useRoute } from 'vue-router';
import { ElNotification } from 'element-plus'

// 从路由中取出当前页的spuid
const rt = useRoute();
const spuId = rt.query.id
console.log(spuId)

// const spu = ref(null)
const spu = reactive({
    id: '',
    title: '',
    subTitle: '',
    cid1: '',
    cName1: '',
    cid2: '',
    cName2: '',
    cid3: '',
    cName3: '',
    brandId: '',
    brandName: '',
    saleable: '',
    valid: '',
    createTime: '',
    lastUpdateTime: '',
    description: '',
    specifications: '',
    specTemplate: '',
    packingList: '',
    afterService: '',
    images: '',
    detailImages: '',
    skus: []
})
// const subTitle = ref('')
// const skuList = ref(null)
// // spu.detailImages
// const imageList = ref(null)
// const brandName = ref('')
const loading = ref(true)
const radio = ref(0)
const title = ref('')
const price = ref(0)
// const specifications = ref('')
const ownSpecs = ref('')
const stock = ref(0)

// 根据选中的sku重置页面上显示的信息
const resetInfo = (index) => {
    if (spu.skus.length !== 0) {
        const sku = spu.skus[index];
        price.value = sku.price;
        title.value = sku.title;
        if (sku.ownSpec) ownSpecs.value = JSON.parse(sku.ownSpec)
        // 查询所选定的sku库存
        // ...
    }
}

const getSkusBySpuId = () => {
    loading.value = true
    http.get('/item/detail/' + spuId).then((response) => {
        if (response.data.code === 200) {
            ElNotification.success({
                message: '已成功获取最新数据',
                showClose: false,
                offset: 100,
                duration: 3000
            })
            // ElMessage({
            //     message: '数据已更新',
            //     type: 'success',
            // })
            console.log(response.data.data)
            // 对接收到的数据进行处理
            // 取出spu对象
            const result = response.data.data

            spu.id = result.id
            spu.title = result.title
            spu.subTitle = result.subTitle
            spu.cid1 = result.cid1
            spu.cName1 = result.cname1
            spu.cid2 = result.cid2
            spu.cName2 = result.cname2
            spu.cid3 = result.cid3
            spu.cName3 = result.cname3
            spu.brandId = result.brandId
            spu.brandName = result.brandName
            spu.saleable = result.saleable
            spu.valid = result.valid
            spu.createTime = result.createTime
            spu.lastUpdateTime = result.lastUpdateTime
            spu.description = result.description
            spu.specifications = result.specifications ? JSON.parse(result.specifications) : ''
            spu.specTemplate = result.specTemplate
            spu.packingList = result.packingList ? JSON.parse(result.packingList) : ''
            spu.afterService = result.afterService
            spu.images = result.images
            spu.detailImages = result.detailImages
            spu.skus = result.skus
            console.log(spu)
            // // 取出spu的skuList对象
            // skuList.value = spu.value.skus
            // // 取出品牌的名称
            // brandName.value = spu.value.brandName
            // // 取出额外描述
            // subTitle.value = spu.value.subTitle
            // // 取出描述图的url

            // // 取出详情图的url

            // // 取出spu的商品描述信息对象
            // if (spu.value.specifications) specifications.value = JSON.parse(spu.value.specifications)
            // 默认选中列表中第一个sku,根据它的名称和价格更新页面信息
            resetInfo(0);
            // 设置载入状态为false
            loading.value = false;
        } else {
            ElNotification.warning({
                message: '数据暂时未更新',
                showClose: false,
                offset: 100,
                duration: 3000
            })
            // ElMessage({
            //     message: '数据暂时未更新',
            //     type: 'warning',
            // })
            // 设置载入状态为false
            loading.value = false;
        }
    });
}


const onRadioChange = () => {
    resetInfo(radio.value)
}

getSkusBySpuId()

const test = () => {
    if (spu.value.specifications) console.log(JSON.parse(spu.value.specifications))
}

const urls = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
</script>

<style scoped>
.info-param {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>