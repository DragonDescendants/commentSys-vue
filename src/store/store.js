import { defineStore } from "pinia";
import http from "../api/api";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: "UserState",
  // state: 返回对象的函数
  state: () => ({
    userId: 0,
    userName: "还没有登录",
    name: "还没有登录",
    image: "",
    url: "http://localhost:8888/img/",
    userType: 0,
    // 记录用户上一次浏览到的ItemId
    itemId: 0,
    // 记录用户浏览到了哪一页Question
    itemQuestionPage: 0,
  }),
  getters: {},
  actions: {
    setUserId(id) {
      console.log("id:" + id);
      this.userId = id;
      console.log(this.userId);
    },
    setUserName(name) {
      console.log("username:" + name);
      this.userName = name;
      console.log(this.userName);
    },
    setName(name) {
      console.log("name:" + name);
      this.name = name;
      console.log(this.name);
    },
    setImage(img) {
      console.log("img:" + img);
      this.image = img;
      console.log(this.image);
    },
    setUserType(type) {
      this.userType = type;
    },
    setItemQuesionPage(page) {
      this.itemQuestionPage = page;
    },
    setItemId(id) {
      this.itemId = id;
    },
    resetStore() {
      this.userId = 0;
      this.userName = "还没有登陆";
      this.name = "还没有登陆";
      this.image = "";
      this.itemId = 0;
      this.itemQuestionPage = 0;
      this.userType = 0;
    },
  },
});
