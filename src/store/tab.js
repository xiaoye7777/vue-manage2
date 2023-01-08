//管理菜单相关的数据
import Cookie from 'js-cookie'

export default {
  state: {
    isCollapse: false,  //控制左侧导航栏收起还是展开。true是收起来
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 's-home',
        url: 'Home/Home'
      }
    ],
    menu: []
  },
  mutations: {
    //修改是否收起导航栏的方法
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
    //更新面包屑数据
    SELECTMENU(state, val) {
      console.log('val',val)
      //判断是否要添加新的面包屑（非首页，非已存在的面包屑）
      if(val.name !== 'home') {
        const index = state.tabsList.findIndex(item => item.name === val.name)
        if(index === -1) {
          state.tabsList.push(val)
        }
      }
    },
    //删除某个tag
    CLOSETAG(state,item) {
      console.log('Mutation方法"CLOSETAG"用来删除一个tag,打印一下state和传来的item',state,item)
      //在这里具体处理删除掉的功能
      //老师是findIndex函数找出要删除的下标，然后splice从数组中删掉这一个。
      const index = state.tabsList.findIndex(val => val.name === item.name)
      state.tabsList.splice(index,1)
      //也可以直接过滤，满足条件（每一项的name和要删除的name不一样）的元素组成新数组赋值给tabsList。
      
    },
    //设置menu的数据
    SETMANU(state, val) {
      state.menu = val
      Cookie.set('menu',JSON.stringify(val))
    },
    //动态注册路由
    ADDMENU(state,router) {
      //判断缓存中是否有数据
      if (!Cookie.get('menu')) return
      const menu = JSON.parse(Cookie.get('menu'))
      state.menu = menu
      //组装动态路由的数据
      const menuArray = []
      menu.forEach(item => {
        if (item.children) {
          item.children = item.children.map(item => {
            item.component = () => import(`../views/${item.url}`)
            return item
          })
          menuArray.push(...item.children)
        } else {
          item.component = () => import(`../views/${item.url}`)
          menuArray.push(item)
        }
      });
      console.log(menuArray,'123333333333333333333')
      menuArray.forEach(item => {
        router.addRoute('Main', item)
      })
    }
  }
}