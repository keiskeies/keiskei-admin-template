<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/content/page/conf"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="content:page:conf"
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
  name: 'PageConf',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'createdTime', label: '创建时间' },
        { show: true, edit: true, minWidth: 300, key: 'creator', label: '创建人' },
        { show: true, edit: true, minWidth: 300, key: 'order', label: '排序' },
        { show: true, edit: true, minWidth: 300, key: 'shortName', label: '会议简称' },
        { show: true, edit: true, minWidth: 300, key: 'fullName', label: '会议全称' },
        { show: true, edit: true, minWidth: 300, key: 'address', label: '会议举办地点' },
        { show: true, edit: true, minWidth: 300, key: 'introduce', label: '会议简介' },
        { show: true, edit: true, minWidth: 300, key: 'url', label: '会议官方地址' },
        { show: true, edit: true, minWidth: 300, key: 'beginDate', label: '会议开始日期' },
        { show: true, edit: true, minWidth: 300, key: 'endDate', label: '会议结束日期' },
        { show: true, edit: true, minWidth: 300, key: 'year', label: '年份' },
        { show: true, edit: true, minWidth: 300, key: 'config', label: '配置信息' },
        { show: true, edit: true, minWidth: 300, key: 'isPublic', label: '是否发布' }
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

