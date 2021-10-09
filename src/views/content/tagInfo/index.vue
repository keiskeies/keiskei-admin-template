<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/content/tagInfo"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="content:tagInfo"
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
  name: 'PageTagInfo',
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
          label: '标签名称',
          fixed: 'left',
          align: 'left',
          autofocus: true
        }
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

    }
  }
}
</script>

