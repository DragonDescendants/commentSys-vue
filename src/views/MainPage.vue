<template>
    <div class="main">
        <div class="main-header">
            <el-affix :offset="0">
                <Header :logout="logout" />
            </el-affix>
        </div>
        <div class="main-page">
            <div class="main-container">
                <router-view />
            </div>
        </div>
    </div>
    <el-backtop />
</template>

<script setup>
import Header from './header/MainHeader.vue';
import { useStore } from '../store/store.js'
import http from '../api/api.js'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()

//在页面加载时校验token
http.post('/home/checkToken', {
    token: Cookies.get('token')
}).then((response) => {
    if (response.data.code === 200) {
        // token校验成功,用户登录状态有效
        const user = response.data.data
        // 用户信息存入全局store
        setUserData(store, user);
        //...
    } else {
        // token校验失败，登录状态已经失效，移除token
        Cookies.remove('token')
    }
});


// 登出
const logout = () => {
    http.post('/home/logout', {
        token: Cookies.get('token')
    }).then((response) => {
        Cookies.remove('token')
        router.push('/home')
        store.resetStore()
    }).catch((error) => {
        Cookies.remove('token')
        router.push('/home')
        store.resetStore()
    });
}

const setUserData = (store, user) => {
    store.setUserId(user.id);
    store.setUserName(user.username);
    store.setName(user.name);
    store.setImage(user.img);
    store.setUserType(user.userType);
    // ..
}
</script>

<style>
.router-link-active {
    text-decoration: none;
}
.main-container {
    width: 1000px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
}
.el-textarea__inner {
    height: 75px;
    width: 100%;
    resize: none;
}
.main-header {
    height: 100px;
}
.main-page {
    display: flex;
    /* background-color: whitesmoke; */
    height: calc(100vh - 100px);
}
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
