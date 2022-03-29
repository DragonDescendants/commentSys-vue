<template>
    <div class="question-container">
        <el-space direction="vertical" :fill="true" style="width: 100%;">
            <div class="questions-header" v-if="store.userId !== 0">
                <input-box
                    ref="childInputBox"
                    inputPlaceholder="请输入您的问题内容"
                    :imageUrl="store.url + store.image"
                    buttonText="提交问题"
                    :submit="submit"
                ></input-box>
            </div>
            <div class="questions-header" v-else>
                未
                <el-button type="primary" @click="router.push('/login')">登录</el-button>只能浏览
            </div>
            <el-divider></el-divider>
            <div v-if="loading">数据加载中...</div>
            <div v-else-if="questionList.data.length === 0">
                <el-empty description="暂无人提问"></el-empty>
            </div>
            <div v-for="(question, index) in questionList.data" v-else>
                <question
                    :question="question" 
                ></question>
            </div>

            <el-pagination
                v-model:currentPage="currentPage"
                v-model:page-size="pageSize"
                :disabled="disabled"
                :background="background"
                layout="prev, pager, next, jumper"
                :total="total"
                hide-on-single-page
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </el-space>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '../../../../api/api';
import Question from './Question.vue';
import { ElMessage, ElNotification } from 'element-plus'
import InputBox from '../../../components/InputBox.vue';
import { useStore } from '../../../../store/store';

// 声明数据
const questionList = reactive({
    data: []
});
const loading = ref(true);

// 从路由中取出当前页的spuid
const rt = useRoute();
const spuId = rt.query.id
console.log(spuId)

const router = useRouter();

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const disabled = ref(false)
const total = ref(0)

// 取出store
const store = useStore()

// 加载数据
const getData = (result, loading) => {
    // 重新发送请求获取当前spu下的提问
    http.get('/question/spu/' + spuId, {
        params: {
            page: currentPage.value,
            size: pageSize.value
        }
    }).then((response) => {
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
            result.data = response.data.data
            loading.value = false;
        } else {
            ElNotification.warning({
                message: '未成功获取最新数据',
                showClose: false,
                offset: 100,
                duration: 3000
            })
            // ElMessage({
            //     message: '数据暂时未更新',
            //     type: 'warning',
            // })
        }
    });
}

//得到总数量 
const getTotal = (id) => {
    // 重新发送请求获取当前spu下的提问
    http.get('/question/spu/' + id + '/count').then((response) => {
        if (response.data.code === 200) {
            total.value = response.data.data
        } else {
            // ...
        }
    });
}

// 第一次进入，获取数据
if(store.itemId === spuId){
    if(store.itemQuestionPage !== 0){
        currentPage.value = store.itemQuestionPage
    }
}else{
    store.setItemId(spuId)
    store.setItemQuesionPage(0)
}
getData(questionList, loading)
getTotal(spuId);

// // 当前用户头像
// const url = ref('http://localhost:8888/img/user.jpg')

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
}
// 页面变动
const handleCurrentChange = (val) => {
    console.log(val)
    store.setItemQuesionPage(val)
    getData(questionList, loading)
}

// 根据ref的标签获取子组件inputBox的响应式对象
const childInputBox = ref()

// 提问栏输入的内容
// const inputText = ref('')
const submit = (text) => {
    if (text !== '')
        http.post('/question/ask', {
            // 对哪一个SPU提问
            spuId: spuId,
            // 提问者的id,这里暂时测试
            userId: store.userId,
            // 提问的内容
            text: text
        }).then((response) => {
            if (response.data.code === 200) {
                ElMessage({
                    message: '用户提问成功',
                    type: 'success',
                })
                // 给子组件发一个请求让他清空输入框
                childInputBox.value.clean()
                // 重新获取数据
                getData(questionList, loading)
                getTotal(spuId)
            } else {
                ElMessage({
                    message: '出现问题了呢',
                    type: 'warning',
                })
            }
        });
    else ElMessage.error('还没有填写内容')

}

// // 根据question的id修改它的answer集合
// const resetAnswers = (questionId, answers) => {
//     questionList.data.forEach((question) => {
//         if (question.id === questionId) {
//             question.answers = ref(answers);
//         }
//         // console.log(question.answers);
//     });
// }

// // 根据question的id修改它的answerCount值
// const resetAnswersCount = (questionId, count) => {
//     questionList.data.forEach((question) => {
//         if (question.id === questionId) {
//             question.answerCount = count;
//         }
//         // console.log(question.answers);
//     });
// }

// //点击了每一个question
// const toQuestionDetail = (id) => {
//     router.push({ name: 'questionDetail', query: { id: id } })
// }
</script>

<style>
.question-container {
    /* margin-left: 10%; */
    /* margin-right: 10%; */
    /* margin-left: auto;
    margin-right: auto; */
    width: 100%;
    /* border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6; */
}
.el-textarea__inner {
    height: 75px;
    width: 100%;
    resize: none;
}
.div-inline {
    height: 100px;
    display: inline-block;
}
.questions-header {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>