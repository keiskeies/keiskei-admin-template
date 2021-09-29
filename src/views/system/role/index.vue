<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/system/role"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="system:role"
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import { requestBase } from '@/api/common'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'

export default {
  name: 'SysRole',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'name', label: '角色名称' },
        {
          show: true,
          edit: true,
          minWidth: 600,
          type: 'TREE_MULTI_SELECT',
          optionKey: 'permissionOptions',
          key: 'permissions',
          label: '角色权限'
        }
      ],
      format: {
        // permissions: (data, index) => {
        //   return (data.permissions || []).map(e => e.name).join(',')
        // }
      },
      rules: {
        add: {
          name: [{ required: true, message: '角色名称必填!', trigger: 'blur' }],
          permissions: [{ required: true, message: '请选择角色权限!', trigger: 'change' }]
        },
        edit: {
          name: [{ required: true, message: '角色名称必填!', trigger: 'blur' }],
          permissions: [{ required: true, message: '请选择角色权限!', trigger: 'change' }]
        }
      },
      options: {
        permissionOptions: []
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
      requestBase({ url: '/system/permission', method: 'GET', params: {}}).then(res => {
        this.options.permissionOptions = res.data
      })
    }
  }
}
</script>

