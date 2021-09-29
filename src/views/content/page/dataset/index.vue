<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/content/page/dataset"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="content:page:dataset"
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
  name: 'PageDataset',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'url', label: '数据集URL' },
        { show: true, edit: true, minWidth: 300, key: 'title', label: '标题' },
        { show: true, edit: true, minWidth: 300, key: 'abstract_', label: '摘要' },
        { show: true, edit: true, minWidth: 300, key: 'info', label: '简介' },
        { show: true, edit: true, minWidth: 300, key: 'homePage', label: '主页' },
        { show: false, edit: false, minWidth: 300, key: 'datasetId', label: '数据集ID' },
        { show: false, edit: true, minWidth: 300, key: 'benchmarks', label: 'benchmark', type: 'OBJECT' },
        { show: false, edit: true, minWidth: 300, key: 'loaders', label: 'loader', type: 'OBJECT' },
        { show: false, edit: true, minWidth: 300, key: 'papers', label: 'paper', type: 'OBJECT' }
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

