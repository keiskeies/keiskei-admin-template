<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

import { detail as getDashboardDetail } from '@/api/dashboad/dashboard'

const animationDuration = 2000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    windowsSize: {
      type: Number,
      default: 0
    },
    dashboardId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      chart: null,
      optionTemp: {
        title: {},
        darkMode: 'auto',
        toolbox: {
          feature: {
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack']
            },
            restore: {
              show: true,
              icon: 'M22,1.4L9.9,13.5l12.3,12.3 M10.3,13.5H54.9v44.6 H10.3v-26',
            },
            saveAsImage: {
              show: true,
              type: 'png'
            },
            myRefresh: {
              show: true,
              title: '刷新',
              icon: 'M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5',
              onclick: this.handleGetDetail
            },
            mySetting: {
              show: true,
              title: '编辑',
              icon: 'M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28',
              onclick: this.edit
            }
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          data: [],
          axisTick: {
            alignWithLabel: true,
            show: false
          }
        },
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        legend: {
          data: []
        },
        series: []
      },
      serie: {
        barWidth: '60%',
        name: 'data',
        stack: 'vistors',
        smooth: true,
        type: 'line',
        data: [],
        animationDuration
      }
    }
  },
  watch: {
    windowsSize() {
      this.chart.resize()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    handleGetDetail(init = false) {
      getDashboardDetail(this.dashboardId).then(res => {
        const series = []
        res.data.series.forEach(e => {
          const serie = Object.assign({}, this.serie)
          serie.data = e.data
          serie.type = e.type.toLowerCase()
          serie.name = e.name
          series.push(serie)
        })
        if (init) {
          const optionTemp = Object.assign(this.optionTemp)
          optionTemp.legend.data = res.data.legend.data
          optionTemp.xAxis.data = res.data.axis.data
          optionTemp.title = res.data.title
          optionTemp.series = series

          if (res.data.horizontal) {
            const xAxis = Object.assign(optionTemp.xAxis)
            optionTemp.xAxis = Object.assign(optionTemp.yAxis)
            optionTemp.yAxis = Object.assign(xAxis)
          }
          this.chart.resize()
          this.chart.setOption(optionTemp)
        } else {
          this.chart.resize()
          this.chart.setOption({
            series: series
          })
        }
      })
    },
    initChart() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.handleGetDetail(true)
    },
    edit() {
      this.$emit('handleSetDashboard', this.dashboardId)
    }
  }
}
</script>
