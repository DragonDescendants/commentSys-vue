<template>
    <el-row :gutter="0">
        <el-col :span="3" class="demo-border"></el-col>
        <el-col :span="18">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                router
                active-text-color="#67C23A"
                @select="handleSelect"
            >
                <img src="../../assets/logo.png" style="width: 40px;height: 40px;" />
                <el-icon color="#67C23A" :size="40" @click="back">
                    <caret-left />
                </el-icon>
                <el-icon color="#67C23A" :size="40" @click="forward">
                    <caret-right />
                </el-icon>
                <el-menu-item index="/home">
                    <span class="header-font">热门</span>
                </el-menu-item>
                <el-menu-item index="/item" disabled>
                    <span class="header-font">分类</span>
                </el-menu-item>
                <el-menu-item index="/detail">
                    <span class="header-font">详情</span>
                </el-menu-item>
                <!-- <el-menu-item index="3" disabled>管理</el-menu-item> -->
                <el-menu-item index="/user">
                    <span class="header-font">用户</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="3" class="demo-border"></el-col>
    </el-row>
</template>

<script setup>
import { ref } from 'vue'
import { CaretLeft, CaretRight } from '@element-plus/icons-vue'

defineProps({
    msg: String
})

const count = ref(0)

const activeIndex = ref('/home')

const handleSelect = (key, keyPath) => {
    console.log(key, keyPath)
}

const back = () => {
    alert('点击了返回按钮')
    console.log('点击了返回按钮')
}

const forward = () => {
    alert('点击了前进按钮')
    console.log('点击了前进按钮')
}
</script>

<style scoped>
.header-font {
    font-size: larger;
    font-weight: bolder;
}
.demo-border {
    border-bottom: 1px solid #dcdfe6;
}
.el-menu {
    --el-menu-item-height: 40px;
}
</style>