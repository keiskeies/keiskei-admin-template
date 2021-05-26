<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/log/operateLog" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="log:operateLog"></base-list>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'

export default {
  name: 'OperateLog',
  components: {BaseList},
  directives: {permission, waves},
  data() {
    return {
      columns: [
        {show: true, edit: false, queryFlag: true, sortable: false, minWidth: 200, key: 'name', label: '操作名称', type: 'WORD'},
        {show: true, edit: false, queryFlag: true, sortable: false, width: 200, key: 'type', label: '操作类型', type: 'WORD'},
        {show: true, edit: false, queryFlag: true, sortable: false, width: 300, key: 'url', label: '操作链接', type: 'WORD'},
        {show: false, edit: false, queryFlag: false, sortable: false, width: 200, key: 'requestParam', label: '请求参数'},
        {show: false, edit: false, queryFlag: false, sortable: false, width: 200, key: 'responseParam', label: '返回结果'},
        {show: true, edit: false, queryFlag: true, sortable: true, width: 200, type: 'DATE_TIME', key: 'createTime', label: '创建时间'},
      ],
      format: {
      },
      rules: {
      },
      options: {
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

