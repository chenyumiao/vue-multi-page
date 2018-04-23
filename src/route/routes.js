/**
 * Created by chenyumiao on 2018/4/19.
 */

import Index from '../module/index/views/index.vue'
import My from '../module/index/views/my.vue'
import MyAccount from '../module/index/views/my-account.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//创建路由实例
const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/index'
    },
    {
      path:'/index',
      component:Index,
    },
    {
      path:'/my',
      component:My
    },
    {
      path:'/my/account',
      component:MyAccount
    }
  ]
})
export  default router
