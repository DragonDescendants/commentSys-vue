import {
  createRouter,
  createWebHistory,
} from "vue-router";
import Cookies from "js-cookie";
import { ElMessage } from "element-plus";
// 仅做示例，根据业务修改路径等
// const Home = () => import("../views/home/Home.vue");

const routes = [
  {
    path: "/",
    redirect: "/home",
    name: "main",
  },
  {
    path: "/home",
    component: () => import("../views/main/Home.vue"),
    name: "home",
    meta: {
      title: "首页",
    },
  },
  {
    path: "/login",
    component: () => import("../views/user/UserLogin.vue"),
    name: "login",
    meta: {
      title: "登录页",
    },
  },
  // {
  //   path: "/item",
  //   component: () => import("../views/item/Items.vue"),
  //   name: "item",
  //   meta: {
  //     title: "商品首页",
  //   },
  // },
  { path: "/item", redirect: "/home", name: "itemGoHome" },
  {
    path: "/item",
    component: () => import("../views/item/detail/ItemMainPage.vue"),
    name: "itemDetail",
    meta: {
      title: "单个商品详情页",
    },
    children: [
      {
        path: "info",
        component: () => import("../views/item/detail/info/ItemInfoPage.vue"),
        name: "itemDetailInfo",
      },
      {
        path: "question",
        component: () =>
          import("../views/item/detail/question/ItemQuestionPage.vue"),
        name: "itemDetailQA",
      },
      {
        path: "comment",
        component: () =>
          import("../views/item/detail/comment/ItemCommentPage.vue"),
        name: "itemDetailCom",
      },
    ],
  },
  {
    path: "/question",
    component: () => import("../views/question/QuesionMainPage.vue"),
    name: "questionDetail",
  },
  // {
  //   path: "/user",
  //   redirect: "/home",
  //   name: "userGoHome",
  //   meta: {
  //     requireAuth: true,
  //   },
  // },
  // {
  //   path: "/messages",
  //   redirect: "/messages/question",
  //   name: "userGoQuestionMessage",
  //   meta: {
  //     requireAuth: true,
  //   },
  // },
  {
    path: "/messages",
    component: () => import("../views/user/UserMessagePage.vue"),
    redirect: "/messages/question",
    name: "userMessages",
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "answer",
        component: () => import("../views/user/message/AnswerMessages.vue"),
        name: "userAnswerMessages",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "comment",
        component: () => import("../views/user/message/CommentMessages.vue"),
        name: "userCommentMessages",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "question",
        component: () => import("../views/user/message/QuestionMessages.vue"),
        name: "userQuestionMessages",
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/user",
    component: () => import("../views/user/UserMainPage.vue"),
    redirect: "/user/detail",
    name: "user",
    meta: {
      title: "用户首页",
      requireAuth: true,
    },
    children: [
      {
        path: "detail",
        component: () => import("../views/user/childrens/UserDetail.vue"),
        name: "userDetail",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "questions",
        component: () => import("../views/user/childrens/UserQuestions.vue"),
        name: "userQuesions",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "answers",
        component: () => import("../views/user/childrens/UserAnswers.vue"),
        name: "userAnswers",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "comments",
        component: () => import("../views/user/childrens/UserComments.vue"),
        name: "userComments",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "discusses",
        component: () => import("../views/user/childrens/UserDiscusses.vue"),
        name: "userDiscusses",
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "attentions",
        component: () => import("../views/user/childrens/UserAttentions.vue"),
        name: "userAttentions",
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  // {
  //   path: "/messages",
  //   component: () => import("../views/user/UserMessagePage.vue"),
  //   redirect: "/messages/question",
  //   name: "userMessages",
  //   meta: {
  //     requireAuth: true,
  //   },
  // },
  {
    path: "/report",
    component: () => import("../views/report/ReportMainPage.vue"),
    name: "reportPage",
    meta: {
      requireAuth: true,
    },
  },
  // 最后一个,其他地址重定向回主页
  {
    path: "/:catchAll(.*)", // 不识别的path自动匹配404
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: routes,
});

//前置路由
router.beforeEach((to, from, next) => {
  // console.log(from.path);
  // console.log(to.path);
  if (to.meta.requireAuth) {
    if (Cookies.get("token")) {
      next();
    } else {
      ElMessage({
        message: '该页面需要登陆',
        type: "error",
      });
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
