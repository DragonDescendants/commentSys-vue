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
import http from '../../api/api';
import { useStore } from '../../store/store';

const props = defineProps({
    // 举报目标的id
    targetId: {
        type: Number,
        require: true
    },
    // 举报目标的类型(提问/回答/评价/讨论)
    targetType: {
        type: String,
        require: true
    }
})
const store = useStore()
const inputText = ref('')
const dialogVisible = ref(false)

const dialogClose = () => {
    console.log('点击了关闭按钮')
    dialogVisible.value = false
}
const dialogSubmit = () => {
    if (inputText.value.length < 15) {
        ElMessage({
            message: '举报理由需在15字以上',
            type: 'warning'
        })
        return;
    }
    console.log('提交了对类型为' + props.targetType + ',id为' + props.targetId + '的举报')
    if (props.targetType === 'question' ||
        props.targetType === 'answer' ||
        props.targetType === 'disccussion' ||
        props.targetType === 'comment') {
        let targetTypeNumber = 0
        switch (props.targetType) {
            case 'question': targetTypeNumber = 0; break;
            case 'answer': targetTypeNumber = 1; break;
            case 'comment': targetTypeNumber = 2; break;
            case 'disccussion': targetTypeNumber = 3; break;
            default: targetTypeNumber = 0
        }
        http.post('/report/commit', {
            // #{report.userId}, #{report.targetId}, #{report.reason}, #{report.targetType}
            userId: store.userId,
            targetId: props.targetId,
            reason: inputText.value,
            targetType: targetTypeNumber,
        }).then((response) => {
            if (response.data.code === 200) {
                // 提交完成后
                inputText.value = ''
                dialogVisible.value = false
                ElMessage({
                    message: '您的举报提交成功',
                    type: 'success',
                })
                uploadRef.value.clearFiles()
            } else {
                ElMessage({
                    message: '提交失败',
                    type: 'error',
                })
            }
        })
    } else {
        ElMessage({
            message: '出现异常,未能成功获取举报类型',
            type: 'error'
        })
        return;
    }
}

const report = () => {
    dialogVisible.value = true
}
</script>

<style>
</style>