<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/system/department"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="system:department"
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
  name: 'SysDepartment',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        {
          show: true,
          edit: true,
          minWidth: 300,
          key: 'name',
          label: '部门名称',
          fixed: 'left',
          align: 'left',
          autofocus: true
        },
        {
          show: false,
          edit: false,
          width: 200,
          type: 'DATE_TIME',
          key: 'createTime',
          label: '创建时间'
        }
      ],
      format: {},
      rules: {
        add: {
          name: [{ required: true, message: '部门名称必填!', trigger: 'blur' }],
          sign: [{ required: true, message: '部门标识必填!', trigger: 'blur' }]
        },
        edit: {
          name: [{ required: true, message: '部门名称必填!', trigger: 'blur' }],
          sign: [{ required: true, message: '部门标识必填!', trigger: 'blur' }]
        }
      },
      options: {}
    }
  },

  created() {
    this.handleGetOptions()
  },
  mounted() {
  },
  methods: {
    handleGetOptions() {

    }
  }
}
</script>

