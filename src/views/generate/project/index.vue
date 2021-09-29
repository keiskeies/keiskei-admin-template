<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/generate/project"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="generate:project"
        edit-page
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import { getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase } from '@/api/common'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'

export default {
  name: 'ProjectInfo',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: false, minWidth: 300, key: 'name', label: '项目名称' },
        { show: true, edit: false, width: 200, key: 'version', label: '版本号' },
        { show: true, edit: false, width: 200, key: 'favicon', label: 'favicon', type: 'IMAGE' },
        { show: true, edit: false, width: 200, key: 'logo', label: 'LOGO', type: 'IMAGE' },
        { show: true, edit: false, width: 200, key: 'author', label: '作者' }
      ],
      format: {
      },
      rules: {
        add: {
        },
        edit: {
        }
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

