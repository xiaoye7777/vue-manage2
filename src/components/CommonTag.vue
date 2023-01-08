<template>
  <div class="tabs">
    <el-tag 
      v-for="(item,index) in tags" 
      :key="item.path" 
      :closable="item.name !== 'home'"
      :effect="$route.name === item.name? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="handleClose(item)"
      size="small"
      >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name:'CommonTag',
  data(){
    return {

    }
  },
  computed: {
    ...mapState({
      tags:state => state.tab.tabsList
    })
    //...mapState('tab',['tags'])
  },
  methods: {
    ...mapMutations(['CLOSETAG']),
    //点击tag跳转的功能
    changeMenu(item) {
      this.$router.push({name:item.name})
      console.log('跳转了，打印一下item', item)
    },
    //点击删除tag
    handleClose(item) {
      this.CLOSETAG(item)  //调用Mutation函数删掉这个tag（从state的tagsList中）
      const len = this.tags.length   //这里是删除后的新的长度奥
      console.log('len2',this.tags.length)
      console.log('打印一下name',this.$route.name,item.name)
      if(this.$route.name !== item.name) {
        console.log('进入非高亮判断，打印一下item。name',item.name)
        return             //如果删除的是非高亮，即非当前页面，就直接删掉tag喽，也不用动路由
      }
      this.$router.push(this.tags[len - 1].name)
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  padding: 20px;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>