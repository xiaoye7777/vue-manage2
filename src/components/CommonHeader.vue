<template>
  <div class="header-container">
    <div class="l-content">
      <el-button style="margin-right:20px;" @click="handleMenu" icon="el-icon-menu" size="mini"></el-button>
      <!-- 面包屑 -->
      <!-- <span class="text">首页</span> -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in tags" :key="item.path"
          :to="{ path: item.path }">{{ item.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link">
          <img class="avatar" src="../assets/images/user.png" alt="">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'

export default {
  name: 'CommonHeader',
  methods: {
    //...mapMutations('tab',{handleMenu:'collapseMenu'})
    handleMenu() {
      console.log('点击了收起按钮', this.$store.state.tab)
      this.$store.commit('collapseMenu')

    },
    handleClick(command) {
      if (command === 'logout') {
        Cookie.remove('token')  //清token
        Cookie.remove('menu')  //清menu
        this.$router.push('/login')
      }

    }
  },
  computed: {
    //...mapMutations('tab',{handleMenu:'collapseMenu'})
    ...mapState({
      tags: state => state.tab.tabsList
    })
  }
}
</script>

<style lang="less" scoped>
.header-container {
  background-color: #333;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .l-content {
    display: flex;
    align-items: center;

    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;

        &.is-link {
          color: #666
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: #fff;
        }
      }
    }
  }

  .r-content {
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%
    }
  }
}
</style>