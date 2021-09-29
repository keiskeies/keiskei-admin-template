<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/system/permission"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="system:permission"
        :default-expand-all="true"
        :tree-table="true"
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
  name: 'SysPermission',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        {
          show: true,
          edit: true,
          minWidth: 200,
          key: 'name',
          label: '权限名称',
          fixed: 'left',
          align: 'left'
        },
        {
          show: true,
          edit: true,
          minWidth: 200,
          key: 'permission',
          label: '权限标识',
          align: 'left'
        },
        {
          show: true,
          edit: true,
          minWidth: 200,
          key: 'path',
          label: 'API',
          align: 'left'
        },
        {
          show: true,
          edit: true,
          width: 100,
          key: 'method',
          label: 'Method',
          type: 'DICTIONARY',
          optionKey: 'methodOptions'
        },
        {
          show: true,
          edit: true,
          width: 140,
          key: 'sortBy',
          label: '排序',
          type: 'SORT'
        }
      ],
      format: {},
      rules: {
        add: {
          name: [{ required: true, message: '权限名称!', trigger: 'blur' }],
          permission: [{ required: true, message: '权限标识!', trigger: 'change' }]
        },
        edit: {
          name: [{ required: true, message: '权限名称!', trigger: 'blur' }],
          permission: [{ required: true, message: '权限标识!', trigger: 'change' }]
        }
      },
      options: {
        methodOptions: [{ id: 'GET', name: 'GET' }, { id: 'POST', name: 'POST', type: 'success' }, {
          id: 'PUT',
          name: 'PUT',
          type: 'warning'
        }, { id: 'PATCH', name: 'PATCH', type: 'info' }, { id: 'DELETE', name: 'DELETE', type: 'danger' }]
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

