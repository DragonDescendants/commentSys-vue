<template>
    <el-tooltip class="box-item" effect="light" content="举报" placement="right-start">
        <el-button type="danger" :icon="Warning" circle @click.stop="report()"></el-button>
    </el-tooltip>
    <el-dialog
        v-model="dialogVisible"
        title="举报提问"
        width="50%"
        :close-on-click-modal="false"
        :append-to-body="true"
    >
        <!-- 输入评论 -->
        <el-input
            v-model.trim="inputText"
            maxlength="100"
            placeholder="请写下您的举报理由(请勿恶意举报!)"
            show-word-limit
            type="textarea"
        />
        <!-- 点评对话框的底部 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click.stop="dialogClose()">取消</el-button>
                <el-button type="primary" @click.stop="dialogSubmit()">提交</el-button>
            </span>
        </template>
        <!-- ... -->
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';

const props = defineProps({
    targetId: {
        type: Number,
        default: true
    },
    targetType: {
        type: String,
        require: true
    }
})
const inputText = ref('')
const dialogVisible = ref(false)

const dialogClose = () => {
    console.log('点击了关闭按钮')
    dialogVisible.value = false
}
const dialogSubmit = () => {
    if (inputText.value.length < 15) {
        ElMessage
    }
    console.log('提交了对类型为' + props.targetType + ',id为' + props.targetId + '的举报')
    // let pathString = ''
    // if (filePathList.value.length !== 0) {
    //     pathString = filePathList.value.join(',')
    //     console.log(filePathList.value)
    //     console.log(pathString)
    // }
    // console.log('点击了提交按钮')
    // if (inputText.value === '') {
    //     ElMessage({
    //         message: '您还没有填写任何内容',
    //         type: 'warning',
    //     })
    // } else if (radio.value === 0) {
    //     ElMessage({
    //         message: '您还没有选择您要点评的商品规格',
    //         type: 'warning',
    //     })
    // }
    // else {
    //     http.post('/comment/sku', {
    //         skuId: radio.value,
    //         userId: store.userId,
    //         level: starValue.value,
    //         text: inputText.value,
    //         images: pathString
    //     }).then((response) => {
    //         if (response.data.code === 200) {
    //             // 提交完成后
    //             inputText.value = ''
    //             dialogVisible.value = false
    //             ElMessage({
    //                 message: '您的点评提交成功',
    //                 type: 'success',
    //             })
    //             uploadRef.value.clearFiles()
    //         } else {
    //             ElMessage({
    //                 message: '提交失败',
    //                 type: 'error',
    //             })
    //         }
    //     }).catch(() => {
    //         ElMessage({
    //             message: '提交失败',
    //             type: 'error',
    //         })
    //     })

    // }

}

const report = () => {
    dialogVisible.value = true
}
</script>

<style>
</style>