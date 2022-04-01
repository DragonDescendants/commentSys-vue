<template>
    <!-- 根据Sku展示评论或者展示所有评论 -->
    <el-space>
        <el-select
            v-model="value"
            class="m-2"
            placeholder="显示全部"
            size="large"
            @change="onSelectChange"
        >
            <el-option label="显示全部" :value="0"></el-option>
            <el-option v-for="sku in skus.data" :key="sku.id" :label="sku.title" :value="sku.id"></el-option>
        </el-select>
        <div v-if="store.userId !== 0">
            <!-- 普通用户登陆 -->
            <el-button type="primary" @click="dialogVisible = true" v-if="store.userType === 0">撰写点评</el-button>
            <!-- 管理员用户登陆 -->
            <el-button
                type="primary"
                @click="dialogVisible = true"
                v-else-if="store.userType === 1"
            >设定标签模板</el-button>
        </div>
    </el-space>
    <!-- 普通用户点评对话框 -->
    <el-dialog
        v-if="store.userType === 0"
        v-model="dialogVisible"
        title="撰写点评"
        width="50%"
        :before-close="handleClose"
    >
        <div>
            <!-- 选择sku -->
            <el-radio-group v-model="radio">
                <div>
                    <el-radio v-for="sku in skus.data" :label="sku.id">{{ sku.title }}</el-radio>
                    <!-- <el-radio :label="6">Option B</el-radio>
                    <el-radio :label="9">Option C</el-radio>-->
                </div>
            </el-radio-group>
            <!-- ... -->
            <!-- 评分 -->
            <div>
                <el-rate
                    v-model="starValue"
                    :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
                    show-text
                ></el-rate>
            </div>
            <!-- ... -->
            <!-- value[0]是map的键，value[1]是map的值 -->
            <el-check-tag
                v-for="(value, key) in spuLabelTemplate.data"
                :checked="value[1]"
                @change="onLabelChange(value[0], value[1])"
            >{{ value[0].text }}</el-check-tag>
            <!-- 输入评论 -->
            <el-input
                class="comment-input"
                v-model="inputText"
                maxlength="500"
                placeholder="请写下您的锐评"
                show-word-limit
                type="textarea"
            />
            <!-- ... -->
            <!-- 在这里带图 -->
            <el-dialog v-model="innerVisible" width="30%" title="图片预览" append-to-body>
                <img :src="innerUrl" />
            </el-dialog>
            <div>
                <!-- <div style="font-size: medium;">头像</div> -->
                <el-tooltip effect="dark" placement="left" content="评价图片支持jpg/png/gif格式,大小应在1MB以内">
                    <div style="margin-top: 20px;">
                        <el-avatar
                            v-for="(src, index) in fileShowUrl.data"
                            :src="src"
                            :size="120"
                            @click="removeImage(index)"
                        />
                        <el-avatar
                            v-if="fileShowUrl.data.length < 9"
                            :size="120"
                            @click="selectImage"
                        >晒图</el-avatar>
                    </div>
                </el-tooltip>
                <input
                    v-show="false"
                    ref="uploadInput"
                    type="file"
                    class="dl-none"
                    name="icon"
                    @change="onBeforeImageInput"
                    multiple
                />
            </div>
        </div>
        <!-- 点评对话框的底部 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogClose()">取消</el-button>
                <el-button type="primary" @click="commentSubmit()">提交</el-button>
            </span>
        </template>
        <!-- ... -->
    </el-dialog>
    <!-- 管理员标签模板设定对话框 -->
    <el-dialog
        v-else-if="store.userType === 1"
        v-model="dialogVisible"
        title="设定评价标签模板"
        width="50%"
    >
        <div>
            <!-- value[0]是map的键，value[1]是map的值 -->
            <el-tag
                v-for="(value, key) in spuLabelTemplate.data"
                :key="key"
                :closable="true"
                @close="handleLabelClose(value[0])"
            >{{ value[0].text }}</el-tag>
            <el-input
                v-if="addTagInputVisible"
                ref="InputRef"
                v-model.trim="inputTagValue"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
            />
            <el-button v-else size="small" @click="showTagInput">+ New Tag</el-button>
        </div>
    </el-dialog>
    <!-- 选择展示的评价星级 -->
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item index="0">全部评价</el-menu-item>
        <el-menu-item index="5">5星评价</el-menu-item>
        <el-menu-item index="4">4星评价</el-menu-item>
        <el-menu-item index="3">3星评价</el-menu-item>
        <el-menu-item index="2">2星评价</el-menu-item>
        <el-menu-item index="1">1星评价</el-menu-item>
    </el-menu>
    <!-- 评价列表 -->
    <div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="noMore">
            <div v-if="comments.data.length > 0" v-for="(comment, index) in comments.data">
                <comment :comment="comment" :onClick="showReplys" :index="index">
                    <span
                        style="font-family: FangSong;font-weight: 800;"
                    >{{ skus.data.filter(sku => sku.id === comment.skuId)[0].title }}</span>
                </comment>
            </div>
        </div>
        <!-- <el-divider></el-divider> -->
        <div class="flex-center">
            <div v-if="loading">加载中...</div>
            <div v-else-if="!noMore">
                <el-button type="text" @click="load()">加载更多</el-button>
            </div>
            <div v-if="noMore">没有更多了...</div>
        </div>
    </div>
    <!-- 评价下的讨论抽屉 -->
    <el-drawer
        v-model="isCommentReplysShow"
        title="讨论都在这儿啦!"
        direction="rtl"
        size="30%"
        :before-close="handleRepliesClose"
        custom-class="right-replies"
    >
        <!-- {{comments.data[selectIndex]}} -->
        <div
            style="color: red;font-size: larger;margin-bottom: 10px;"
        >{{ selectIndex === -1 ? '' : comments.data[selectIndex].userName }}</div>
        <span
            style="font-size:large;font-weight: bold;"
        >{{ selectIndex === -1 ? '' : comments.data[selectIndex].text }}</span>
        <el-divider></el-divider>
        <!-- 普通用户才能讨论 -->
        <div
            v-if="store.userType === 0"
            style="display: flex;align-items: flex-end;flex-direction: column;"
        >
            <textarea
                v-model.trim="replyInputText"
                style="resize: none;width: 100%;height: 80px;"
                placeholder="在这里写下您想对这条评价说的话"
                maxlength="100"
            ></textarea>
            <span style="margin-top: 10px;"></span>
            <el-button style="width: 20%;" @click="replyComment()">提交</el-button>
        </div>
        <div v-if="selectIndex === -1 || comments.data[selectIndex].replies.length === 0">暂无人讨论</div>
        <div v-else v-for="(reply, index) in comments.data[selectIndex].replies">
            <discussion :discussion="reply" isMessage></discussion>
            <!-- <el-container style="padding-left: 0px;padding-right: 10px;">
                <el-aside width="60px">
                    <el-avatar
                        shape="circle"
                        :size="60"
                        fit="contain"
                        :src="store.url + reply.userImg"
                    ></el-avatar>
                </el-aside>
                <el-main style="padding-top: 0px;padding-bottom: 0px;">
                    <el-space style="margin-top: 10px;">
                        <div style="color: red;font-size: medium;">
                            {{ reply.userName }}
                            <span
                                v-if="store.userName == reply.userName"
                            >&nbsp;(我)&nbsp;</span>
                        </div>
                        <div style="color: gray;font-size: small;">{{ reply.createTime }}</div>
                    </el-space>
                    <div
                        style="font-size: medium;margin-top: 10px;font-weight: bold;"
                    >{{ reply.text }}</div>
                </el-main>
            </el-container>
            <el-divider></el-divider> -->
        </div>
    </el-drawer>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router';
import { Plus } from '@element-plus/icons-vue'
import http from '../../../../api/api';
import { useStore } from '../../../../store/store';
import Comment from './Comment.vue';
import Discussion from './Discussion.vue';

const route = useRoute()
const spuId = route.query.id;

const store = useStore()

const page = ref(0)
const size = ref(5)
const loading = ref(false)
const noMore = ref(false)
const value = ref('')

const skus = reactive({
    data: []
})

const comments = reactive({
    data: []
})

const spuLabelTemplate = reactive({
    data: new Map()
})

// const comment = reactive({
//     id: '',
//     skuId: '',
//     userId: '',
//     userName: '',
//     level: '',
//     text: '',
//     createTime: '',
//     approval: '',
//     images: '',
//     replies: []
// })

const activeIndex = ref('0')
const level = ref(0)
// 点击了评价等级选择框
const handleSelect = (key, keyPath) => {
    level.value = parseInt(key)
    comments.data = []
    page.value = 0
    noMore.value = false
    load()
    console.log(parseInt(key))
    console.log(key, keyPath)
}

// 选择的skuId
const selectedSkuId = ref(0)
// 选择了其他的sku
const onSelectChange = (val) => {
    selectedSkuId.value = val
    comments.data = []
    page.value = 0
    noMore.value = false
    load()
    console.log('选择的是:' + selectedSkuId.value)
}

// 点评上传图片
const uploadRef = ref()
const innerVisible = ref(false)
const innerUrl = ref('')
const filePathList = ref([])
const handleAvatarSuccess = (res, file) => {
    console.log(res)
    console.log(file.response)
    filePathList.value.push(res)
    console.log(filePathList.value)
}
const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2
    const isCount9 = filePathList.value.length < 9
    if (!isJPG) {
        ElMessage.error('Avatar picture must be JPG format!')
    }
    if (!isLt2M) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
    }
    if (!isCount9) {
        ElMessage.error('最多只能带9张图!')
    }
    return isJPG && isLt2M && isCount9
}
const handleRemove = (file, fileList) => {
    console.log(file.response)
    for (let i = 0, len = filePathList.value.length; i < len; i++) {
        if (filePathList.value[i] === file.response) {
            filePathList.value.splice(i, 1)
            break
        }
    }
    console.log(filePathList.value)
    console.log(file, fileList)
}
const handlePreview = (file) => {
    innerVisible.value = true
    innerUrl.value = file.url
    console.log(file)
}

/**
 * 对话框相关操作
 */
// 评价对话框里面的已选择的skuId
const radio = ref(0)
// 评价对话框里面的评价内容
const inputText = ref('')
const starValue = ref(5)
const dialogVisible = ref(false)
const handleClose = (done) => {
    ElMessageBox.confirm('确定不写下锐评就走嘛?',
        '注意',
        {
            confirmButtonText: '不写了',
            cancelButtonText: '再想想'
        })
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
const dialogClose = () => {
    console.log('点击了关闭按钮')
    dialogVisible.value = false
}

/**
 * 提交点评(旧)
 */
const dialogSubmit = () => {
    let pathString = ''
    if (filePathList.value.length !== 0) {
        pathString = filePathList.value.join(',')
        console.log(filePathList.value)
        console.log(pathString)
    }
    console.log('点击了提交按钮')
    if (inputText.value === '') {
        ElMessage({
            message: '您还没有填写任何内容',
            type: 'warning',
        })
    } else if (radio.value === 0) {
        ElMessage({
            message: '您还没有选择您要点评的商品规格',
            type: 'warning',
        })
    }
    else {
        let labels = []
        spuLabelTemplate.data.forEach(function (value, key) {
            if (value === true) {
                labels.push(key.text)
                spuLabelTemplate.data.set(key, false)
            }
            console.log(value, key);
        });
        console.log(labels)
        http.post('/comment/sku', {
            skuId: radio.value,
            userId: store.userId,
            level: starValue.value,
            text: inputText.value,
            images: pathString,
            labels: labels
        }).then((response) => {
            if (response.data.code === 200) {
                // 提交完成后
                inputText.value = ''
                dialogVisible.value = false
                ElMessage({
                    message: '您的点评提交成功',
                    type: 'success',
                })
                uploadRef.value.clearFiles()
                reload()
            } else {
                ElMessage({
                    message: '提交失败',
                    type: 'error',
                })
            }

        }).catch(() => {
            ElMessage({
                message: '提交失败',
                type: 'error',
            })
        })

    }

}

/**
 *  查询SPU下的所有SKU信息
 *  
 */
const getSkus = () => {
    http.get('/item/skus/' + spuId).then((response) => {
        if (response.data.code === 200) {
            skus.data = response.data.data
        }
    })
}
getSkus()


/**
 * 查询Spu的评价标签模板
 */
const getSpuLabelTemplates = () => {
    http.get('/item/labelTemplate/' + spuId).then((response) => {
        if (response.data.code === 200) {
            const result = response.data.data
            spuLabelTemplate.data = new Map()
            for (let i = 0, len = result.length; i < len; i++) {
                spuLabelTemplate.data.set(result[i], false)
            }
            console.log(spuLabelTemplate.data)
        }
    })
}
getSpuLabelTemplates()

const onLabelChange = (key, value) => {
    spuLabelTemplate.data.set(key, !value)
    console.log(spuLabelTemplate.data)
}

/**
 * label被删除了
 * @param {*} tag 的本体
 */
const handleLabelClose = (tag) => {
    console.log(tag)
    http.delete('/admin/spu/labelTemplate/' + tag.id).then((response) => {
        if (response.data.code === 200) {
            spuLabelTemplate.data.delete(tag)
        } else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
        }
    })
}
/**
 * 管理员添加标签部分
 */
const inputTagValue = ref('')
const addTagInputVisible = ref(false)
const InputRef = ref()

const showTagInput = () => {
    addTagInputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

// 管理员提交标签模板
const handleInputConfirm = () => {
    if (inputTagValue.value) {
        http.post('/admin/spu/labelTemplate', {
            spuId: spuId,
            text: inputTagValue.value
        }).then((response) => {
            if (response.data.code === 200) {
                spuLabelTemplate.data.set({
                    id: response.data.data,
                    spuId: spuId,
                    text: inputTagValue.value
                }, false)
                addTagInputVisible.value = false
                inputTagValue.value = ''
            } else {
                ElMessage({
                    message: '出现问题了呢',
                    type: 'warning',
                })
            }
        })

    }

}

/**
 * 未手动指定SKU,查询全部评价[1,5]星
 */
const getCommentsBySpuId = () => {
    loading.value = true
    // level.value代表选定的星级，默认值0，即为全选
    http.get('/comment/spu/' + spuId + '/' + level.value, {
        params: {
            page: page.value + 1,
            size: size.value,
        }
    }).then((response) => {
        const code = response.data.code
        if (code === 200) {
            const result = response.data.data
            for (let i = 0, len = result.length; i < len; i++) {
                comments.data.push(result[i])
            }
            page.value++
            loading.value = false
        } else if (code === 600) {
            // 已经没有更多了,禁用无限滚动框
            loading.value = false
            noMore.value = true
        }
        else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
            // 如果服务器出错,禁用无限滚动框
            loading.value = false
            noMore.value = true
        }
    }).catch(() => {
        // 如果服务器出错,禁用无限滚动框
        loading.value = false
        noMore.value = true
    })
}

/**
 * 手动指定了SKU,单个SKU的评价
 */
const getCommentsBySkuId = () => {
    loading.value = true
    http.get('/comment/sku/' + selectedSkuId.value + '/' + level.value, {
        params: {
            page: page.value + 1,
            size: size.value,
        }
    }).then((response) => {
        const code = response.data.code
        if (code === 200) {
            const result = response.data.data
            for (let i = 0, len = result.length; i < len; i++) {
                comments.data.push(result[i])
            }
            page.value++
            loading.value = false
        } else if (code === 600) {
            // 已经没有更多了,禁用无限滚动框
            loading.value = false
            noMore.value = true
        }
        else {
            ElMessage({
                message: '出现问题了呢',
                type: 'warning',
            })
            // 如果服务器出错,禁用无限滚动框
            loading.value = false
            noMore.value = true
        }
    }).catch(() => {
        // 如果服务器出错,禁用无限滚动框
        loading.value = false
        noMore.value = true
    })
}

// 无限滚动load评价
const load = () => {
    if (noMore.value === false && loading.value === false) {
        console.log('去请求新数据了')
        if (selectedSkuId.value === 0) {
            getCommentsBySpuId()
        } else {
            getCommentsBySkuId()
        }

    }
}

//重新读取无限滚动的评价
const reload = () => {
    const num = (page.value - 1) * size.value
    for (let i = comments.data.length - 1, fin = num - 1; i > fin; i--) {
        comments.data.pop()
    }
    page.value--
    noMore.value = false
    load()
}

const isCommentReplysShow = ref(false)
const selectIndex = ref(-1)
const replyInputText = ref('')

const showReplys = (index) => {
    isCommentReplysShow.value = true
    selectIndex.value = index
    // comment = comments.data[index]
}

const handleRepliesClose = (done) => {
    selectIndex.value = -1
    done()
}

// 提交对评价的讨论
const replyComment = () => {
    if (replyInputText.value === '') {
        ElMessage({
            message: '您还没有输入讨论内容',
            type: 'warning',
        })
        return;
    }
    http.post("/comment/reply", {
        commentId: comments.data[selectIndex.value].id,
        userId: store.userId,
        text: replyInputText.value
    }).then((response) => {
        if (response.data.code === 200) {
            // 提交完成后
            ElMessage({
                message: '您的讨论提交成功',
                type: 'success',
            })
            // 更新讨论数据
            //...
            comments.data[selectIndex.value].replies.push({
                id: response.data.data,
                userId: store.userId,
                userName: store.userName,
                userImg: store.image,
                commentId: comments.data[selectIndex.value].id,
                text: replyInputText.value,
                createTime: '最近',
                approval: 0,
                approvalUserIds: []
            })
            replyInputText.value = ''
        } else {
            ElMessage({
                message: '提交失败',
                type: 'error',
            })
        }
    }).catch(() => {
        ElMessage({
            message: '提交失败',
            type: 'error',
        })
    })
}

/*--------------图片上传相关-------------------*/
// 存放file对象的数组
// const fileObjectArray = reactive({
//     data: []
// })
let fileObjectArray = []
const fileShowUrl = reactive({
    data: []
})
// 上传框的ref对象
const uploadInput = ref();
// 图片文件校验
const onBeforeImageInput = (event) => {
    const input = event.target;
    const files = input.files;
    if (files && files.length > 0) {
        for (let currentFile of files) {
            if (fileObjectArray.length >= 9) {
                ElMessage({
                    type: "warning",
                    message: "图片数量太多了,最多只能附带9张图片"
                })
                return;
            }
            let isImg = currentFile.type === 'image/jpeg' || currentFile.type === 'image/png' || currentFile.type === 'image/gif'
            let isLess1MB = currentFile.size / 1024 < 1024
            if (isImg && isLess1MB) {
                console.log('currentFile:', currentFile)
                fileObjectArray.push(currentFile)
                console.log(fileObjectArray)
                const fileReader = new FileReader()
                fileReader.readAsDataURL(currentFile);
                fileReader.onload = () => {
                    fileShowUrl.data.push(fileReader.result)
                }
            } else {
                fileObjectArray.indexOf(currentFile)
                // fileObjectArray.data = fileObjectArray.data.filter(item => item !== currentFile)
                ElMessage({
                    type: "warning",
                    message: "文件参数不合法,应为jpg/png格式,且大小在1MB以内"
                })
                // input.files = null
                // input.value = null
            }
        }

    }
}

//选择图片
const selectImage = () => {
    // console.log(uploadInput.value)
    let oBtn = uploadInput.value;
    oBtn.click();
}

//移除图片
const removeImage = (index) => {
    ElMessageBox.confirm(
        '确定要移除这张图片吗?',
        '确认',
        {
            confirmButtonText: '不要了',
            cancelButtonText: '再想想',
            type: 'warning',
        }
    )
        .then(() => {
            //从图片文件数组和图片预览数组中移除索引为index的元素
            fileObjectArray.splice(index, 1)
            fileShowUrl.data.splice(index, 1)
            ElMessage({
                type: 'success',
                message: '该图片已经移除',
            })
        })
        .catch(() => {
            // ElMessage({
            //     type: 'info',
            //     message: 'Delete canceled',
            // })
        })
}

// 提交点评(新)
const commentSubmit = () => {
    if (inputText.value === '') {
        ElMessage({
            message: '您还没有填写任何内容',
            type: 'warning',
        })
        return;
    }
    if (radio.value === 0) {
        ElMessage({
            message: '您还没有选择您要点评的商品规格',
            type: 'warning',
        })
        return;
    }
    if (fileObjectArray) {
        //处理选中的标签,将它们添加进数组
        let labels = []
        spuLabelTemplate.data.forEach(function (value, key) {
            if (value === true) {
                labels.push(key.text)
                spuLabelTemplate.data.set(key, false)
            }
            console.log(value, key);
        });
        console.log(labels)
        console.log(fileObjectArray)
        // 构建表单
        let formdata = new FormData()
        // let images = fileObjectArray.data
        formdata.append('skuId', radio.value)
        formdata.append('userId', store.userId)
        formdata.append('level', starValue.value)
        formdata.append('text', inputText.value)
        formdata.append('labels', labels)
        fileObjectArray.forEach(file => {
            formdata.append('images', file)
        })
        http.post('/file/comment/commit', formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.code === 200) {
                // 提交完成后
                inputText.value = ''
                dialogVisible.value = false
                console.log("成功上传!")
                fileObjectArray = []
                fileShowUrl.data = []
                ElMessage({
                    type: "success",
                    message: "评价提交成功"
                })
                // uploadInput.value.clearFiles()
                reload()
            } else {
                ElMessage({
                    type: "error",
                    message: "评级提交失败,请重试"
                })
            }
        })
    }
}
/* ---------------------------------------------- */

</script>

<style>
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
.right-replies {
    background-color: whitesmoke;
}
.comment-input textarea {
    resize: none;
    height: 200px;
}
</style>