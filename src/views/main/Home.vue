<template>
    <div style="height: 100%;" class="full-width">
        <span v-if="loading">加载中</span>
        <hot itemList="result" v-else></hot>
    </div>
</template>

<script setup>
import { reactive, provide } from 'vue'
import getHotItems from '../../util/getHotList';
import Hot from './Hot.vue';

defineProps({
    msg: String
})

const { loading, result } = getHotItems('/item/hot')
provide('itemList', result)
console.log(result)
</script>

<style scoped>
.el-menu {
    --el-menu-item-height: 30px;
}
.el-header {
    height: 350px;
}
</style>