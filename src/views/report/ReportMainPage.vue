<template>
    <div style="height: 99.5%;">
        <el-card style="height: 100%;overflow: auto;">
            <h1>举报中心</h1>
            <div v-if="store.userType == 0">
                <h5>普通用户</h5>
            </div>
            <div v-else-if="store.userType == 1">
                <div style="display: flex;height: 50px;">
                    <div style="font-size: large;font-weight: bold;">商户管理员</div>
                    <div style="margin-left: auto;">
                        <el-button type="primary" @click="reload">刷新</el-button>
                    </div>
                </div>

                <div>
                    <TransitionGroup tag="div" name="fade" class="container">
                        <div v-for="(report, index) in reports.data" :key="index">
                            <!-- <li>{{report.id}}</li>
                    <li>{{report.userId}}</li>
                    <li>{{report.userName}}</li>
                    <li>{{report.targetId}}</li>
                    <li>{{report.reason}}</li>
                    <li>{{report.targetType}}</li>
                    <li>{{report.status}}</li>
                    <li>{{report.result}}</li>
                    <li>{{report.createTime}}</li>
                            <li>{{report.lastUpdateTime}}</li>-->
                            <el-card shadow="none">
                                <div>
                                    <el-descriptions title="举报信息" :border="false" :column="1">
                                        <template #extra>
                                            <div v-if="report.status === 0">
                                                <el-button
                                                    type="danger"
                                                    @click="rejectedReport(index)"
                                                >驳回</el-button>
                                                <el-popconfirm
                                                    title="确定要通过举报吗?"
                                                    confirm-button-text="确定"
                                                    cancel-button-text="手滑了"
                                                    @confirm="passReport(index)"
                                                >
                                                    <template #reference>
                                                        <el-button type="success">通过</el-button>
                                                    </template>
                                                </el-popconfirm>
                                            </div>
                                            <div
                                                v-else-if="report.status === 1"
                                                style="color: #67C23A;"
                                            >已通过</div>
                                            <div
                                                v-else-if="report.status === 2"
                                                style="color: #F56C6C;"
                                            >已驳回</div>
                                            <div
                                                v-else-if="report.status === 3"
                                                style="color: #909399;"
                                            >已撤销</div>
                                        </template>
                                        <el-descriptions-item label="举报编号">{{ report.id }}</el-descriptions-item>
                                        <el-descriptions-item label="举报者">
                                            <el-link
                                                style="color: #409EFF;"
                                                @click="toUserDetail(report.userId)"
                                            >{{ report.userName }}</el-link>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="举报目标类型">
                                            <span v-if="report.targetType === 0">提问</span>
                                            <span v-else-if="report.targetType === 1">回答/回复</span>
                                            <span v-else-if="report.targetType === 2">评价</span>
                                            <span v-else-if="report.targetType === 3">讨论</span>
                                            <!-- {{ report.targetType }} -->
                                        </el-descriptions-item>
                                        <el-descriptions-item label="举报目标文本">
                                            <span style="color: #E6A23C;">
                                                <span
                                                    v-if="report.targetType === 0"
                                                >"{{ report.question.text }}"</span>
                                                <span v-else-if="report.targetType === 1">回答/回复</span>
                                                <span v-else-if="report.targetType === 2">评价</span>
                                                <span v-else-if="report.targetType === 3">讨论</span>
                                            </span>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="举报原因">{{ report.reason }}</el-descriptions-item>
                                        <el-descriptions-item
                                            label="处理结果"
                                            v-if="report.status !== 0"
                                        >{{ report.result }}</el-descriptions-item>
                                        <!-- <el-descriptions-item label="操作">
                                        <el-button>驳回</el-button>
                                        <el-button>通过</el-button>
                                        </el-descriptions-item>-->
                                    </el-descriptions>
                                    <!-- {{ report }} -->
                                </div>
                            </el-card>
                            <div style="margin-top: 10px;"></div>
                            <!-- <hr /> -->
                        </div>
                    </TransitionGroup>
                </div>
                <div class="flex-center">
                    <div v-if="loading">加载中...</div>
                    <div v-else-if="noMore">
                        <div>没有更多待处理的举报了...</div>
                    </div>
                    <div v-else>
                        <el-button type="primary" @click="getReports">加载更多</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import http from '../../api/api';
import { useStore } from '../../store/store';
import { ElMessage, ElMessageBox } from 'element-plus'

defineProps({
    msg: String
})

const store = useStore()
const router = useRouter()

// const page = ref(0)
const size = ref(2)
const loading = ref(false)
const noMore = ref(false)

const reports = reactive({
    data: []
})

const getReports = () => {
    let lastReportId = 0
    loading.value = true
    if (reports.data.length !== 0) {
        // 从当前已有的数组中取出最后一个元素
        const lastReport = reports.data.slice(-1)
        lastReportId = lastReport[0].id
        console.log(lastReportId)
    }
    http.get('/report/admin/list', {
        params: {
            lastId: lastReportId,
            size: size.value,
        }
    }).then((response) => {
        const code = response.data.code
        if (code === 200) {
            const result = response.data.data
            for (let i = 0, len = result.length; i < len; i++) {
                reports.data.push(result[i])
            }
            // if (result.length !== 0) {
            //     reports.data = result
            // }
            loading.value = false
        } else if (code === 600) {
            // 已经没有更多了
            loading.value = false
            noMore.value = true
        }
        else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
            // 服务器出错
            loading.value = false
            noMore.value = true
        }
    }).catch(() => {
        // 服务器出错
        loading.value = false
        noMore.value = true
    })
}
getReports()

//驳回举报
const rejectedReport = (index) => {
    ElMessageBox.prompt('驳回举报', '操作', {
        confirmButtonText: '确定驳回',
        cancelButtonText: '撤销',
        inputPattern:
            /^([\p{Unified_Ideograph}·]){5,50}$/u,
        inputErrorMessage: '驳回理由不是中文,且长字数不在5-50之间',
    })
        .then((input) => {
            http.put('/report/admin/update', {
                id: reports.data[index].id,
                status: 2,
                targetType: reports.data[index].targetType,
                result: input.value,
            }).then((response) => {
                const code = response.data.code
                if (code === 200) {
                    reports.data[index].status = 2
                    reports.data[index].result = input.value
                    ElMessage({
                        type: 'success',
                        message: '驳回成功,理由是:' + input.value,
                    })
                }
                else {
                    ElMessage({
                        message: '驳回操作未成功',
                        type: 'warning',
                    })
                }
            }).catch(() => {
                ElMessage({
                    message: '驳回操作未成功',
                    type: 'warning',
                })
            })

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
}
//通过举报
const passReport = (index) => {
    http.put('/report/admin/update', {
        id: reports.data[index].id,
        targetId: reports.data[index].targetId,
        targetType: reports.data[index].targetType,
        status: 1,
        result: "举报通过",
    }).then((response) => {
        const code = response.data.code
        if (code === 200) {
            reports.data[index].status = 1
            reports.data[index].result = "举报通过"
            ElMessage({
                type: 'success',
                message: '已通过',
            })
        }
        else {
            ElMessage({
                message: '操作未成功',
                type: 'warning',
            })
        }
    }).catch(() => {
        ElMessage({
            message: '操作未成功',
            type: 'warning',
        })
    })
}

const reload = () => {
    reports.data.splice(0, reports.data.length);
    noMore.value = false
    getReports()
}

const toUserDetail = (id) => {
    router.push({ name: 'userDetail', query: { id: id } })
}
</script>

<style>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
    position: absolute;
}
</style>