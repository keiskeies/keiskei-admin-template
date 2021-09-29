<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/log/operateLog"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="log:operateLog"
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'

export default {
  name: 'OperateLog',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: false, minWidth: 200, key: 'name', label: '操作名称', type: 'WORD', align: 'left' },
        { show: true, edit: false, minWidth: 200, key: 'type', label: '操作类型', type: 'WORD' },
        { show: true, edit: false, minWidth: 300, key: 'url', label: '操作链接', type: 'WORD', align: 'left' },
        { show: false, edit: false, minWidth: 200, key: 'requestParam', label: '请求参数', type: 'OBJECT' },
        { show: false, edit: false, minWidth: 200, key: 'responseParam', label: '返回结果', type: 'OBJECT' },
        { show: true, edit: false, minWidth: 200, key: 'createTime', label: '创建时间', type: 'DATE_TIME' }
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

