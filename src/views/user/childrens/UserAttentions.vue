<template>
<h2>这里是user的所有关注</h2>
</template>

<script setup>
import { ref,inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';

defineProps({
  msg: String
})

const rt = useRoute()
// 从路由中取出当前详情页所属用户的id
const id = rt.query.id

const refresh = inject('refresh')
refresh(id)


const count = ref(0)
</script>