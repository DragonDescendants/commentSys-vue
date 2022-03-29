import axios from "axios";
import Cookies from "js-cookie";
import { ElMessage } from "element-plus";

const http = axios.create({
  baseURL: "http://localhost:8888",
  timeout: 5000, // 设置请求超时时间
});

http.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const token = Cookies.get("token");
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    // 发送失败
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    //从后端返回的状态码code
    const code = response.data.code;
    console.log("后端返回的响应码:" + code);
    // 如果code为470/480说明未登录/登录失效
    // 此时应该跳转到登录页面重新登录
    // ...
    return response;
  },
  (error) => {
    ElMessage({
      message: "出现问题了:" + error.message,
      type: "warning",
    });
    console.log("错误:" + error);
    return Promise.reject(error);
  }
);

export default http;
