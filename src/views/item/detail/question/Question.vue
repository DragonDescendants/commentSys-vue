<template>
    <el-card shadow="hover" @click="toQuestionDetail(question.id)">
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-container style="padding-left: 20px;padding-right: 20px;">
                    <el-aside width="60px">
                        <el-avatar
                            shape="circle"
                            :size="60"
                            fit="contain"
                            :src="store.url + question.userImg"
                        ></el-avatar>
                    </el-aside>
                    <el-main style="padding-top: 0px;padding-bottom: 0px;">
                        <div style="color: red;font-size: medium;">{{ question.userName }}</div>
                        <div
                            style="color: gray;font-size: small;margin-bottom: 10px;"
                        >{{ question.createTime }}&nbsp;提问</div>
                        <div style="font-size: large;margin-bottom: 10px;">{{ question.text }}</div>
                        <div>{{ question.answerCount }}人进行了回答</div>
                    </el-main>
                </el-container>
            </div>
            <div>
                <report-button :targetId="question.id" targetType="question"></report-button>
            </div>
        </div>
       
    </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from '../../../../store/store'
import ReportButton from '../../../components/ReportButton.vue';

const props = defineProps({
    question: Object
})

const store = useStore()

const router = useRouter()
const toQuestionDetail = (id) => {
    router.push({ name: 'questionDetail', query: { id: id } })
}

// const inputText = ref('')
// const dialogVisible = ref(false)
// const handleClose = (done) => {
//     ElMessageBox.confirm('不提交举报了吗?',
//         '注意',
//         {
//             confirmButtonText: '不写了',
//             cancelButtonText: '再想想'
//         })
//         .then(() => {
//             done()
//         })
//         .catch(() => {
//             // catch error
//         })
// }

// const dialogClose = () => {
//     console.log('点击了关闭按钮')
//     dialogVisible.value = false
// }
// const dialogSubmit = () => {
//     console.log('提交了举报')
//     // let pathString = ''
//     // if (filePathList.value.length !== 0) {
//     //     pathString = filePathList.value.join(',')
//     //     console.log(filePathList.value)
//     //     console.log(pathString)
//     // }
//     // console.log('点击了提交按钮')
//     // if (inputText.value === '') {
//     //     ElMessage({
//     //         message: '您还没有填写任何内容',
//     //         type: 'warning',
//     //     })
//     // } else if (radio.value === 0) {
//     //     ElMessage({
//     //         message: '您还没有选择您要点评的商品规格',
//     //         type: 'warning',
//     //     })
//     // }
//     // else {
//     //     http.post('/comment/sku', {
//     //         skuId: radio.value,
//     //         userId: store.userId,
//     //         level: starValue.value,
//     //         text: inputText.value,
//     //         images: pathString
//     //     }).then((response) => {
//     //         if (response.data.code === 200) {
//     //             // 提交完成后
//     //             inputText.value = ''
//     //             dialogVisible.value = false
//     //             ElMessage({
//     //                 message: '您的点评提交成功',
//     //                 type: 'success',
//     //             })
//     //             uploadRef.value.clearFiles()
//     //         } else {
//     //             ElMessage({
//     //                 message: '提交失败',
//     //                 type: 'error',
//     //             })
//     //         }
//     //     }).catch(() => {
//     //         ElMessage({
//     //             message: '提交失败',
//     //             type: 'error',
//     //         })
//     //     })

//     // }

// }

// const report = () => {
//     dialogVisible.value = true
// }
</script>

<style>
.el-divider--horizontal {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>