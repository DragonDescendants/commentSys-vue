<template>
    <el-card>
        <!-- <div class="scrollbar-flex-content">
            <el-carousel :interval="4000" height="400px">
                <el-carousel-item v-for="(item, index) in itemList" :key="index">
                    <item-card :item="item" @click="goItemDetail(item.id)"></item-card>
                </el-carousel-item>
            </el-carousel>
        </div>

        <el-carousel :interval="5000" direction="vertical" height="400px">
            <el-carousel-item v-for="(item, index) in itemList" :key="index">
                <item-card :item="item" @click="goItemDetail(item.id)"></item-card>
            </el-carousel-item>
        </el-carousel>-->
        <div style="margin: 20px;font-size: larger;font-weight: bolder;">热门商品</div>
        <el-carousel :interval="4000" type="card" height="400px">
            <el-carousel-item v-for="(item, index) in itemList" :key="index">
                <item-card
                    style="width: 476px;text-align: center;"
                    :item="item"
                    @click="goItemDetail(item.id)"
                ></item-card>
            </el-carousel-item>
        </el-carousel>

        <div>
            <div style="margin: 20px;font-size: larger;font-weight: bolder;">最新商品</div>
            <el-space direction="horizontal" wrap>
                <item-card
                    v-for="(item, index) in itemList"
                    :key="index"
                    :item="item"
                    @click="goItemDetail(item.id)"
                ></item-card>
            </el-space>
        </div>
    </el-card>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router';
import ItemCard from '../item/ItemCard.vue';

defineProps({

})
const itemList = inject('itemList')
console.log(itemList)
const total = ref(6)

const router = useRouter()

const goItemDetail = (id) => {
    console.log(id)
    router.push({ name: 'itemDetailInfo', query: { id: id } })
}

const count = ref(0)
const load = () => {
    count.value += 2
}
</script>

<style scoped>
.scrollbar-flex-content {
    width: 100%;
}
.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 300px;
    height: 350px; */
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-lighter);
    color: var(--el-color-danger);
}
</style>