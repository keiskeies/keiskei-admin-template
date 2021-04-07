<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/system/scheduledTask" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="system:scheduledTask"></base-list>
    </div>
  </div>
</template>

<script>
import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'

export default {
  name: 'ScheduledTask',
  components: {BaseList},
  directives: {permission, waves},
  data() {
    return {
      columns: [
        {show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'cron', label: '表达式'},
        {show: true, edit: true, queryFlag: false, sortable: false, width: 200, key: 'cronKey', label: '任务KEY'},
        {show: true, edit: true, queryFlag: false, sortable: false, width: 200, key: 'param', label: '任务参数'},
        {show: true, edit: true, queryFlag: false, sortable: false, width: 200, key: 'description', label: '任务描述'},
        {show: true, edit: true, queryFlag: false, sortable: false, width: 200, key: 'enable', label: '是否启用', type: 'STATUS'},
      ],
      format: {
      },
      rules: {
        add: {
          cron: [{required: true, message: '表达式!', trigger: 'blur'}],
          cronKey: [{required: true, message: '任务KEY!', trigger: 'blur'}],
          param: [{required: true, message: '任务参数!', trigger: 'blur'}],
          description: [{required: true, message: '任务描述!', trigger: 'blur'}],
          enable: [{required: true, message: '是否启用!', trigger: 'blur'}],
        },
        edit: {
          cron: [{required: true, message: '表达式!', trigger: 'blur'}],
          cronKey: [{required: true, message: '任务KEY!', trigger: 'blur'}],
          param: [{required: true, message: '任务参数!', trigger: 'blur'}],
          description: [{required: true, message: '任务描述!', trigger: 'blur'}],
          enable: [{required: true, message: '是否启用!', trigger: 'blur'}],
        }
      },
      options: {
        permissionOptions: [],
      }
    }
  },

  created() {
    this.handleGetOptions()
  },
  mounted() {
  },
  methods: {
    handleGetOptions() {
      this.options = JSON.parse(localStorage.getItem('allOptions')) || this.options
    }
  }
}
</script>

