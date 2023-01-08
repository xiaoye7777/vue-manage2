<template>
  <!-- 这里原来的是 default-active="1-4-1"，为了让样式和面包屑点击的路由同步，就按弹幕修改成了 :default-active="$route.path"，记得前面是v-bind，不是冒号 -->
  <!-- 有bug，只对子路由生效，并且一级路由还搞丢了，点两次才出现动态高亮样式 -->
  <el-menu default-active="1-4-1"  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    :collapse="isCollapse" 
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <h3>{{ isCollapse ? '后台' : '通用后台管理系统' }}</h3>

    <!-- 前三个无子项的导航菜单 -->
    <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>

    <!-- 下面的“其他”，和他的子菜单 -->
    <el-submenu v-for="item in hasChildren" :key="item.label" index="item.label">
      <template  slot="title">
        <i :class="`el-icon-${item.icon}`"></i>
        <span  slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        
        <el-menu-item @click="clickMenu(subItem)" :index="subItem.path">{{subItem.label}}</el-menu-item>
        
      </el-menu-item-group>
      
    </el-submenu>
    
    
  </el-menu>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  name: 'CommonAside',
  data() {
    return {
      //isCollapse: false,
      // menuData:[
      //   {
      //     path:'/',
      //     name:'home',
      //     label:'首页',
      //     icon:'s-home',
      //     url:'Home/Home'
      //   },
      //   {
      //     path:'/mall',
      //     name:'mall',
      //     label:'商品管理',
      //     icon:'video-play',
      //     url:'MallManage/MallManage'
      //   },
      //   {
      //     path:'/user',
      //     name:'user',
      //     label:'用户管理',
      //     icon:'user',
      //     url:'UserManage/UserManage'
      //   },
      //   {
      //     label:'其他',
      //     icon:'location',
      //     children:[
      //       {
      //         path:'/page1',
      //         name:'page1',
      //         label:'页面1',
      //         icon:'setting',
      //         url:'Other/PageOne'
      //       },
      //       {
      //         path:'/page2',
      //         name:'page2',
      //         label:'页面2',
      //         icon:'setting',
      //         url:'Other/PageTwo'
      //       }
      //     ]
      //   }
      // ]
    };
  },
  computed:{
    noChildren(){
      return this.menuData.filter(item => !item.children)
    },
    hasChildren(){
      return this.menuData.filter(item => item.children)
    },
    //...mapState('tab',['isCollapse'])
    isCollapse(){
      return this.$store.state.tab.isCollapse
    },
    menuData() {
      return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu 

    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //点击跳转
    clickMenu(item){
      console.log('点击了导航菜单',item)
      //当目标页面与当前页面不一致的时候才允许跳转
      if(this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))){
        this.$router.push(item.path)
      }
      //更新vuex的当前路由数据
      this.$store.commit('SELECTMENU', item)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu  {
  height: 100vh;
  h3 {
    color:#fff;
    text-align:center;
    line-height:48px
  }
  border-right: none;
}
</style>