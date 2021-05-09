<template>
  <div class="app-container">
<!--    <user-corner class="user-corner" />-->
<!---->
<!--    <panel-group @handleSetLineChartData="handleSetLineChartData" />-->

<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->

    <template  v-for="line in charts">
      <el-row :gutter="10">
        <template v-for="item in line">
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: item.span * 8}" >
            <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>{{item.span}}</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>

              <div class="chart-wrapper">
                <raddar-chart v-if="item.type === 'raddar'"/>
                <pie-chart v-if="item.type === 'pie'"/>
                <bar-chart v-if="item.type === 'bar'"/>
                <line-chart v-if="item.type === 'line'" :chart-data="lineChartData"/>
              </div>
            </el-card>
          </el-col>
        </template>
<!--        <el-col :xs="24" :sm="24" :lg="8">-->
<!--          <div class="chart-wrapper">-->
<!--            <pie-chart />-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :xs="24" :sm="24" :lg="8">-->
<!--          <div class="chart-wrapper">-->
<!--            <bar-chart />-->
<!--          </div>-->
<!--        </el-col>-->
      </el-row>
    </template>


<!--    <el-row :gutter="8">-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
<!--        <transaction-table />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <todo-list />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <box-card />-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import UserCorner from '@/components/UserCorner/index'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    UserCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      charts: [],


      lineChartData: lineChartData.newVisitis
    }
  },
  created() {
    let data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        type: ['','line','pie', 'raddar', 'bar'][Math.ceil(Math.random()*4)],
        span: Math.ceil(Math.random()*3)
      })
    }
    let echarts = [[]]
    let line = 0;
    let index = 0;
    data.forEach(item => {
      index += item.span;
      if (index / 3 > line + 1) {
        index = (line + 1) * 3
      }
      echarts[line].push(item)
      if (index % 3 === 0) {
        echarts.push([])
        line += 1
      }
    })
    console.log(echarts)
    this.charts = echarts;
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .user-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    position: relative;
    .chart-button {
      height: 100px;
      width: 100px;
      display: block;
      position: absolute;
      background-color: #0a76a4;
      right: 0;
      top: 0;
    }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
