<template>
  <div class="app-container">
    <!--    <todo-list />-->
    <!---->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--      <line-chart :chart-data="lineChartData" />-->
    <!--    </el-row>-->
    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
        <div style="text-align: center">
          <el-button type="primary" icon="el-icon-plus" circle @click="handleAddDashboard()" />
        </div>
      </el-col>
      <el-col :xs="{span: 16}" :sm="{span: 16}" :md="{span: 8}" :lg="{span: 8}" :xl="{span: 10}">
        <div style="text-align: center">
          <el-button type="primary" icon="el-icon-plus" circle @click="handleAddDashboard()" />
        </div>
      </el-col>
      <el-col :xs="{span: 8}" :sm="{span: 8}" :md="{span: 4}" :lg="{span: 4}" :xl="{span: 2}">
        <div style="text-align: center">
          <el-button type="primary" icon="el-icon-plus" circle @click="handleAddDashboard()" />
        </div>
      </el-col>
    </el-row>
    <!--    图表列表-->
    <el-row :gutter="10">
      <template v-for="item in charts">
        <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: item.span * 8}" :xl="{span: item.span * 8}">
          <el-card class="box-card" shadow="hover" style="margin-top: 10px" :body-style="{padding: 0}">
            <div class="chart-wrapper">
              <pie-chart v-if="item.type === 'PIE'" :ref="'chart_' + item.id" :dashboard-id="item.id" :windows-size="windowsSize" @handleSetDashboard="handleSetDashboard" />
              <line-chart v-if="item.type === 'LINE_BAR'" :ref="'chart_' + item.id" :dashboard-id="item.id" :windows-size="windowsSize" @handleSetDashboard="handleSetDashboard" />
              <raddar-chart v-if="item.type === 'RADAR'" :ref="'chart_' + item.id" :dashboard-id="item.id" :windows-size="windowsSize" @handleSetDashboard="handleSetDashboard" />
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <!--    图表编辑-->
    <el-dialog :title="(temp.id ? '新增图表 - ' : '编辑图表 - ') + (temp.name || '')" :visible.sync="dialogVisible" :width="$store.state.app.device === 'mobile' ? '100%' : '60%'">
      <el-form ref="dashboard" :model="temp" label-width="auto" label-suffix=": " style="margin: 0 15px">
        <el-form-item label="图表名称" prop="name">
          <el-input v-model="temp.name" clearable />
        </el-form-item>
        <el-form-item label="时间类型" prop="timeType">
          <el-radio v-for="item in timeTypeOptions" :key="item.name" v-model="temp.timeType" :label="item.id" :value="item.id">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item v-if="temp.timeType === 'NORMAL'" label="时间起点" prop="start">
          <el-date-picker v-model="temp.start" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="时间字段" prop="timeField">
          <el-input v-model="temp.timeField" clearable />
        </el-form-item>
        <el-form-item v-if="temp.timeType === 'NORMAL'" label="时间结点" prop="end">
          <el-date-picker v-model="temp.end" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="图表主类型" prop="type">
          <el-radio v-for="item in chartTypeOptions" :key="item.type" v-model="temp.type" :label="item.id" :value="item.id">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item label="图表宽度" prop="span">
          <el-input-number v-model="temp.span" :min="1" :max="3" clearable />
        </el-form-item>
        <el-form-item v-if="temp.type === 'LINE_BAR'" label="xy坐标翻转" prop="horizontal">
          <el-switch v-model="temp.horizontal" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item v-if="temp.type === 'LINE_BAR'" label="x坐标名称" prop="fieldName">
          <el-input v-model="temp.fieldName" clearable />
        </el-form-item>
        <el-form-item label="x坐标类型" prop="fieldType">
          <el-radio v-for="item in fieldTypeOptions" :key="item.type" v-model="temp.fieldType" :label="item.id" :value="item.id">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item v-if="temp.fieldType === 'TIME'" label="时间间隔类型" prop="fieldDelta">
          <el-radio v-for="item in fieldDeltaOptions" :key="item.type" v-model="temp.fieldDelta" :label="item.id" :value="item.id">{{ item.name }}</el-radio>
        </el-form-item>
        <el-form-item label="y坐标" prop="directions">
          <el-card>
            <el-row v-for="(direction, index) in temp.directions" :key="index" :gutter="20">
              <el-col :span="23">
                <div class="y-field-card" style="margin-bottom: 10px">
                  <el-form :ref="'dashboard_direction_' + index" :model="direction" label-width="auto" label-suffix=": " style="margin: 16px 15px 0 15px" inline>
                    <el-form-item label="数据来源" prop="entityClass">
                      <el-select v-model="direction.entityClass" clearable @change="handleGetTableFields">
                        <el-option v-for="item in tableOptions" :key="item.key" :label="item.value" :value="item.key" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="数据名称" prop="name">
                      <el-input v-model="direction.entityName" clearable />
                    </el-form-item>
                    <el-form-item v-if="direction.entityClass" label="数据字段" prop="field">
                      <el-select v-model="direction.field" clearable>
                        <el-option v-for="item in fieldOptions[direction.entityClass.split('.').join('_')]" :key="item.key" :label="item.value" :value="item.key" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="!temp.type || temp.type === 'LINE_BAR'" label="图表类型" prop="type">
                      <el-radio v-model="direction.type" label="LINE" value="line">折线图</el-radio>
                      <el-radio v-model="direction.type" label="BAR" value="bar">柱状图</el-radio>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col v-if="index" :span="1">
                <div style="text-align: center">
                  <el-button type="info" icon="el-icon-delete" circle @click="temp.directions.splice(index, 1)" />
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <div style="text-align: center">
                  <el-button type="primary" icon="el-icon-plus" circle @click="temp.directions.push({})" />
                </div>
              </el-col>
            </el-row>
          </el-card>

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-popconfirm :v-permission="['dashboard:delete']" title="是否删除这条数据？" icon-color="red" icon="el-icon-info" confirm-button-type="danger" style="margin-left: 10px;float: left" @onConfirm="handleDeleteDashboard(temp.id)">
          <el-button slot="reference" v-waves type="danger">删除</el-button>
        </el-popconfirm>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="temp.id ? handleUpdateDashboard() : handleCreateDashboard()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import TodoList from './components/TodoList'
// import BarChart from './components/BarChart'
import { list as getDashboardList, create as createDashboard, update as updateDashboard, deleteById as deleteDashboard, tables as getTables, tableFields as getTableField } from '@/api/dashboad/dashboard.js'
export default {
  name: 'DashboardAdmin',
  directives: { permission, waves },
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    TodoList
    // BarChart
  },
  data() {
    return {
      charts: [],
      windowsSize: 0,
      temp: {
        type: undefined,
        timeField: undefined,
        timeType: undefined,
        fieldName: undefined,
        fieldType: undefined,
        fieldDelta: undefined,
        directions: [
          {
            entityClass: undefined,
            entityName: undefined
          }
        ]
      },
      dialogVisible: false,
      tableOptions: [],
      fieldOptions: {},
      timeTypeOptions: [
        { id: 'NORMAL', name: '自定义' },
        { id: 'CURRENT_DAY', name: '当天' },
        { id: 'CURRENT_WEEK', name: '本周' },
        { id: 'CURRENT_MONTH', name: '本月' },
        { id: 'CURRENT_QUARTER', name: '本季度' },
        { id: 'CURRENT_YEAR', name: '本年' }
      ],
      chartTypeOptions: [
        { id: 'LINE_BAR', name: '折线/柱状图' },
        { id: 'PIE', name: '饼图' },
        { id: 'RADAR', name: '雷达图' }
      ],
      fieldDeltaOptions: [
        { id: 'HOUR', name: '小时' },
        { id: 'ALL_HOURS', name: '日期-小时' },
        { id: 'WEEK_DAY', name: '星期' },
        { id: 'MONTH_DAYS', name: '月-日' },
        { id: 'ALL_DAYS', name: '日' },
        { id: 'MONTH', name: '月' },
        { id: 'ALL_MONTHS', name: '年-月' },
        { id: 'QUARTER', name: '季度' },
        { id: 'ALL_QUARTERS', name: '年-季度' },
        { id: 'YEAR', name: '年' }
      ],
      fieldTypeOptions: [
        { id: 'TIME', name: '时间类型' },
        { id: 'FIELD', name: '字段类型' }
      ]
    }
  },
  created() {
    this.handleGetTables()
    this.handleGetDashboardList()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          this.windowsSize = Math.random()
        })
      })()
    }
  },
  methods: {
    handleGetDashboardList() {
      getDashboardList().then(res => {
        if (res.data) {
          this.charts = res.data
        }
      })
    },
    handleAddDashboard() {
      this.temp = {
        directions: [
          {}
        ]
      }
      this.dialogVisible = true
    },
    handleSetDashboard(id) {
      this.temp = Object.assign({}, this.charts.find(e => e.id === id))
      this.temp.directions.forEach(e => {
        this.handleGetTableFields(e.entityClass)
      })
      this.dialogVisible = true
    },
    handleCreateDashboard() {
      if (this.temp.type !== 'LINE_BAR') {
        this.temp.directions.forEach(e => {
          e.type = this.temp.type
        })
      }
      createDashboard(this.temp).then(res => {
        this.charts.push(res.data)
        this.dialogVisible = false
      })
    },
    handleUpdateDashboard() {
      const self = this
      const index = this.charts.findIndex(e => e.id === self.temp.id)
      if (this.temp.type !== 'LINE_BAR') {
        this.temp.directions.forEach(e => {
          e.type = this.temp.type
        })
      }
      updateDashboard(self.temp).then(res => {
        self.$set(self.charts, index, res.data)
        self.dialogVisible = false
        self.$refs['chart_' + self.temp.id][0].initChart()
      })
    },
    handleDeleteDashboard(id) {
      const index = this.charts.findIndex(e => e.id === id)
      deleteDashboard(id).then(res => {
        this.handleGetDashboardList()
        this.charts.splice(index, 1)
        this.dialogVisible = false
      })
    },
    handleGetTables() {
      getTables().then(res => {
        this.tableOptions = res.data || []
      })
    },
    handleGetTableFields(entityClass) {
      if (entityClass) {
        const entityClassStr = entityClass.split('.').join('_')
        if (!this.fieldOptions[entityClassStr]) {
          getTableField({ entityClass: entityClass }).then(res => {
            this.$set(this.fieldOptions, entityClassStr, res.data || [])
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {

  .user-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }
  .y-field-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    background-color: #FFFFFF;;
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
