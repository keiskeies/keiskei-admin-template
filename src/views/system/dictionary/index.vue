<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/system/dictionary"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="system:dictionary"
        tree-table
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
  name: 'Dictionary',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'name', label: '资源名称' },
        { show: true, edit: true, width: 200, key: 'code', label: '资源类型' },
        { show: true, edit: true, width: 200, key: 'type', label: '颜色类型', type: 'DICTIONARY', optionKey: 'typeOptions' },
        { show: true, edit: true, width: 200, key: 'effect', label: '主题', type: 'DICTIONARY', optionKey: 'effectOptions' }
      ],
      format: {
      },
      rules: {
        add: {
          name: [{ required: true, message: '资源名称不能为空!', trigger: 'blur' }],
          code: [{ required: true, message: '资源类型不能为空!', trigger: 'blur' }],
          type: [{ required: true, message: '颜色类型不能为空!', trigger: 'change' }],
          effect: [{ required: true, message: '主题不能为空!', trigger: 'change' }]
        },
        edit: {
          name: [{ required: true, message: '资源名称不能为空!', trigger: 'blur' }],
          code: [{ required: true, message: '资源类型不能为空!', trigger: 'blur' }],
          type: [{ required: true, message: '颜色类型不能为空!', trigger: 'change' }],
          effect: [{ required: true, message: '主题不能为空!', trigger: 'change' }]
        }
      },
      options: {
        typeOptions: [{ id: 'success' }, { id: 'primary' }, { id: 'danger' }, { id: 'none' }],
        effectOptions: [{ id: 'dark' }, { id: 'plain' }]
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
      //
    }
  }
}
</script>

