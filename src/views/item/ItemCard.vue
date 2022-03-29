<template>
  <el-card shadow="hover">
    <div class="card-body">
      <el-image :src="'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'" fit="contain"></el-image>
      <div style="padding: 15px">
        <div>{{ item.title }}</div>
        <div class="price">￥{{ currentPrice }}</div>
        <!-- <div class="bottom">
          <span class="price">￥{{ currentPrice }}</span>
         
        </div> -->
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  item: Object
})

const currentPrice = ref(4999)
</script>

<style scoped>
.price {
  margin-top: 10px;
  font-size: 16px;
  color: red;
  /* text-align: center; */
}
.bottom {
  margin-top: 15px;
  line-height: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
</style>