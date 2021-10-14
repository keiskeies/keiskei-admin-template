<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { detail as getDashboardDetail, refresh as refreshDashBoard } from '@/api/dashboad/dashboard'

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
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              type: 'png'
            },
            myRefresh: {
              show: true,
              title: '刷新',
              icon: 'M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5',
              onclick: this.handleRefreshDetail
            },
            mySetting: {
              show: true,
              title: '编辑',
              icon: 'M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28',
              onclick: this.edit
            }
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '50%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: []
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        series: []
      },
      serie: {
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
          normal: {
            shadowBlur: 13,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
          }
        },
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
    handleGetDetail() {
      getDashboardDetail(this.dashboardId).then(res => {
        const series = []
        res.data.series.forEach(e => {
          const serie = Object.assign({}, this.serie)
          serie.data = e.data
          series.push(serie)
        })
        const optionTemp = Object.assign(this.optionTemp)
        optionTemp.legend.data = res.data.legend.data
        optionTemp.title = res.data.title
        optionTemp.series = series
        optionTemp.radar.indicator = res.data.radar.indicator
        this.chart.resize()
        this.chart.setOption(optionTemp)
      })
    },
    handleRefreshDetail() {
      refreshDashBoard(this.dashboardId).then(res => {
        const series = []
        res.data.series.forEach(e => {
          const serie = Object.assign({}, this.serie)
          serie.data = e.data
          series.push(serie)
        })
        this.chart.resize()
        this.chart.setOption({
          series: series
        })
      })
    },
    initChart() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.handleGetDetail()
    },
    edit() {
      this.$emit('handleSetDashboard', this.dashboardId)
    }
  }
}
</script>
