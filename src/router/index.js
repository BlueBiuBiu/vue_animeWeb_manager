import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/anime',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/AnimeList.vue'),
                    meta: { title: '动漫列表' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/User.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // 国际化组件
                    path: '/comment',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/Comment.vue'),
                    meta: { title: '评论列表' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
