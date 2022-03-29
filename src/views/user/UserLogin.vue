<template>
    <div style="height: 100%;">
        <div class="login-form" v-if="isLogin">
            <el-card>
                <el-space :fill="true" wrap :size="12">
                    <div>
                        <span class="form-header">登录</span>
                    </div>
                    <el-input v-model.trim="username" placeholder="请输入您的用户名">
                        <template #prepend>
                            <div class="inner-input">账号</div>
                        </template>
                    </el-input>
                    <el-input v-model.trim="password" placeholder="请输入密码" show-password>
                        <template #prepend>
                            <div class="inner-input">密码</div>
                        </template>
                    </el-input>
                    <el-button type="primary" @click="login">立即登录</el-button>
                    <el-button type="primary" @click="isLogin = false">还没有账号？马上注册</el-button>
                </el-space>
            </el-card>
        </div>
        <div class="login-form" v-else>
            <el-card>
                <el-space :fill="true" wrap :size="12">
                    <div>
                        <span class="form-header">注册您的账户</span>
                    </div>
                    <el-input v-model.trim="registerUserName" placeholder="请输入您的用户名">
                        <template #prepend>
                            <div class="inner-input">账号</div>
                        </template>
                    </el-input>
                    <el-input v-model.trim="registerPassword" placeholder="请输入密码" show-password>
                        <template #prepend>
                            <div class="inner-input">密码</div>
                        </template>
                    </el-input>
                    <el-input
                        v-model.trim="registerRepetPassword"
                        placeholder="请再次输入密码"
                        show-password
                    >
                        <template #prepend>
                            <div class="inner-input">再次输入密码</div>
                        </template>
                    </el-input>
                    <el-button type="primary" @click="register">立即注册</el-button>
                    <el-button type="primary" @click="isLogin = true">已有账号？马上登陆</el-button>
                </el-space>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import http from '../../api/api';
import Cookies from 'js-cookie'
import { useStore } from '../../store/store';
import { ElMessage } from 'element-plus'

defineProps({
    msg: String
})

const router = useRouter()
const store = useStore()

const username = ref('')
const password = ref('')
const isLogin = ref(true)

const registerUserName = ref('')
const registerPassword = ref('')
const registerRepetPassword = ref('')

// 检验用户是否已经登录,如果已经登录则马上跳转走
onMounted(() => {
    const token = Cookies.get('token')
    if (token)
        router.push('/home')
})

// 登陆
const login = () => {
    // 用户发送请求登录,登录成功后跳转
    http.post('/home/login',
        {
            username: username.value,
            password: password.value
        }
    ).then((response) => {
        if (response.data.code === 200) {
            // 拿到token,放入cookie,并设置过期时间
            const user = response.data.data
            console.log(user.name)
            const token = user.token
            console.log('token:' + token)
            // 这个cookie 15天有效
            Cookies.set('token', token, { expires: 15 })
            // 用户信息存入全局store
            setUserData(store, user);
            username.value = ''
            password.value = ''
            // router.push('/home')
            router.go(-1)
            console.log(Cookies.get('token'))
        } else {
            //...
            ElMessage({
                message: '用户名或密码错误,请检查',
                type: 'warning',
            })
        }
    });
}

// 注册
const register = () => {
    if (registerPassword.value !== registerRepetPassword.value) {
        ElMessage({
            message: '两次输入的密码不一样，请检查！',
            type: 'warning',
        })
    } else {
        // 用户发送请求注册,注册成功后跳转
        http.post('/home/register',
            {
                username: registerUserName.value,
                password: registerPassword.value
            }
        ).then((response) => {
            if (response.data.code === 200) {
                ElMessage({
                    message: '账号注册成功！',
                    type: 'success',
                })
                isLogin.value = true
                username.value = registerUserName.value
                registerUserName.value = ''
                registerPassword.value = ''
                registerRepetPassword.value = ''
            } else {
                //...
                // const result = response.data.data
                // console.log(result)
                // const msg = ''
                // for (var key in result) {
                //     console.log(result[key])
                //     msg = msg + result[key].toString();
                // }
                // console.log(msg)
                ElMessage({
                    message: response.data.data,
                    type: 'warning',
                })
            }
        }).catch((error) => {
            ElMessage({
                message: '服务器出现问题，请稍后再试',
                type: 'warning',
            })
        });
    }

}

//向store中设置当前用户的信息
const setUserData = (store, user) => {
    store.setUserId(user.id);
    store.setUserName(user.username);
    store.setName(user.name);
    store.setImage(user.img);
    store.setUserType(user.userType)
    // ..
}
// const login = () => {
//     // 用户发送请求登录,登录成功后跳转
//     http.post('/home/login',
//         {
//             username: username.value,
//             password: password.value
//         }
//     ).then((response) => {
//         if (response.data.code === 200) {
//             // 拿到token,放入cookie,并设置过期时间
//             const user = response.data.data
//             console.log(user.name)
//             const token = user.token
//             console.log('token:' + token)
//             // 这个cookie 15天有效
//             Cookies.set('token', token, { expires: 15 })
//             // 用户信息存入pinia
//             store.setUserId(user.id)
//             store.setUserName(user.username)
//             store.setName(user.name)
//             // router.push('/home')
//             router.go(-1)
//             console.log(Cookies.get('token'))
//         } else {
//             //...
//             ElMessage({
//                 message: response.data.message,
//                 type: 'warning',
//             })
//         }
//     });
// }
</script>

<style scoped>
.login-form {
    width: 500px;
    margin: 30% auto;
}
.inner-input {
    width: 80px;
    text-align: center;
}
.form-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    font-weight: bolder;
}
</style>