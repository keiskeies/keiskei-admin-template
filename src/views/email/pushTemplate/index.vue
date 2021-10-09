<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/email/pushTemplate"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="email:pushTemplate"
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
  name: 'PushTemplate',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'name', label: '模版名称' },
        { show: false, edit: true, width: 200, key: 'content', label: '模版内容', type: 'HTML' }
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
        permissionOptions: [],
        pushTypeOptions: [
          { id: 'FIXATION', name: '固定', type: 'success' },
          { id: 'DYNAMIC', name: '动态', type: 'danger' }
        ]
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

    }
  }
}
</script>

