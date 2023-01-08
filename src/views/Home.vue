<template>
  <!-- 整体分为左右两大栏，左：右 1：2的比例 -->
  <el-row>
    <!-- 左大栏：用户头像信息 + 下方数据 -->
    <el-col :span="8" style="padding-right:10px">
      <el-card class="box-card">
        <!-- 用户信息部分，再细分为上半头像和昵称 + 下半登录信息 -->
        <div class="user">
          <img src="../assets/images/user.png" alt="">
          <div class="userinfo">
            <p class="name">宵夜</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="loginInfo">
          <p>上次登录的时间：<span>2022-12-31</span></p>
          <p>上次登录的地点：<span>新疆</span></p>
        </div>
      </el-card>

      <!-- 下方的表格 -->
      <el-card style="margin-top:20px; height:460px">
        <el-table :data="tableData" style="width: 100%">

          <!-- <el-table-column prop="name" label="课程" >
          </el-table-column>
          <el-table-column prop="todayBuy" label="今日购买">
          </el-table-column>
          <el-table-column prop="monthBuy" label="本月购买" >
          </el-table-column>
          <el-table-column prop="totalBuy" label="总购买">
          </el-table-column> -->

          <!-- 简化一下，把上面的prop和label做成对象数据遍历出来 -->
          <el-table-column v-for="(val, key) in tabelLabel" :prop="key" :label="val" />
        </el-table>
      </el-card>
    </el-col>


    <!-- 右大栏：订单统计 + 折线图 + 俩小图（柱状图+饼图） -->
    <el-col :span="16" style="padding-left:10px">

      <!-- 右上角的数据统计，金额统计 -->
      <div class="num">
        <el-card v-for="item in countData" :key="item.name" :body-style="{ display: 'flex', padding: 0 }">
          <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
          <div class="detail">
            <p class="price">￥{{ item.value }}</p>
            <p class="disc">{{ item.name }}</p>
          </div>
        </el-card>
      </div>

      <!-- 右中 折线图 -->
      <el-card style="height:280px">
        <div ref="echarts1" style="height:280px"></div>
      </el-card>

      <!-- 右下 俩小图 -->
      <div class="graph">
        <!-- 右下左 柱状图 -->
        <el-card style="height:260px">
          <div ref="echarts2" style="height:260px"></div>
        </el-card>

        <!-- 右下右 饼图 -->
        <el-card style="height:260px">
          <div ref="echarts3" style="height:240px"></div>
        </el-card>
      </div>


    </el-col>
  </el-row>
</template>

<script>
import { getData } from '../api'
import * as echarts from 'echarts'

export default {
  name: 'Home',
  data() {
    return {
      tableData: [],
      tabelLabel: {
        name: '课程',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买'
      },
      countData: [
        {
          name: '今日支付订单',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '今日收藏订单',
          value: 210,
          icon: 'star-on',
          color: '#ffb980'
        },
        {
          name: '今日未支付订单',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef'
        },
        {
          name: '本月支付订单',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '本月收藏订单',
          value: 210,
          icon: 'star-on',
          color: '#ffb980'
        },
        {
          name: '本月未支付订单',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef'
        },
      ]
    }
  },
  mounted() {
    //❓疑问，这个函数好好理解理解
    getData().then(({ data }) => {
      const { tableData } = data.data
      this.tableData = tableData
      console.log(tableData)
      const echarts1 = echarts.init(this.$refs.echarts1)
      //指定图标的配置项和数据
      var echarts1Option = {}
      //处理数据，x轴的
      const { orderData,userData,videoData } = data.data
      const xAxis = Object.keys(orderData.data[0])
      echarts1Option.yAxis = {}
      console.log(xAxis)
      const xAxisData = { data: xAxis }
      echarts1Option.xAxis = xAxisData
      echarts1Option.legend = xAxisData
      echarts1Option.series = []
      xAxis.forEach(key => {
        echarts1Option.series.push({
          name:key,
          data:orderData.data.map(item => item[key]),
          type:'line'
        })
      }),
      console.log('echarts1Option',echarts1Option)
      //根据配置显示图表
      echarts1.setOption(echarts1Option)

      //柱状图 ，话说这个函数也太笨重了吧，咱不是说要尽量纯函数吗？
      const echarts2 = echarts.init(this.$refs.echarts2)
      const echarts2Option = {
        legend: {
          //图例文字颜色
          textStyle: {
            color:'#333'
          },
        },
        grid: {
          left:'20%'
        },
        //提示框
        tooltip:{
          trigger:'axis'
        },
        xAxis:{
          type:'category',//类目轴
          data: userData.map(item => item.date),
          axisLine: {
            lineStyle: {
              color:'#17b3a3'
            }
          },
          axisLabel: {
            interval: 0,
            color: '#333'
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3'
              }
            }
          }
        ],
        color: ['#2ec7c9','#b6a2de'],
        series: [
          {
            name:'新增用户',
            data:userData.map(item => item.new),
            type:'bar'
          },
          {
            name: '活跃用户',
            data:userData.map(item => item.active),
            type: 'bar'
          }
        ]
      }
      echarts2.setOption(echarts2Option)

      //饼图
      const echarts3 = echarts.init(this.$refs.echarts3)
      const echarts3Option = {
        tooltip: {
          trigger: 'item'
        },
        color: [
          '#0f78f4',
          '#dd536b',
          '#9462e5',
          '#a6a6a6',
          '#e1bb22',
          '#39c362',
          '#3ed1cf'          
        ],
        series: [
          {
            data: videoData,
            type: 'pie'
          }
        ]
      }
      echarts3.setOption(echarts3Option)
    })

  }
}
</script>

<style lang="less" scoped>
.user {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }

  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .access {
      color: #999999;
    }
  }
}

.loginInfo {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;
  }
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    color: #fff;
    text-align: center;
    line-height: 80px;
  }

  .detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
  }

  .price {
    font-size: 30px;
    margin-bottom: 10px;
    line-height: 30px;
    height: 30px;
  }

  .disc {
    color: #999;
    font-size: 14px;
    text-align: center;
  }

  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}

.graph {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .el-card {
    width: 48%;
  }
}
</style>