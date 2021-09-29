<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/content/page/topic"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="content:page:topic"
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
  name: 'PageTopic',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'name', label: '英文标题' },
        { show: true, edit: true, minWidth: 300, key: 'nameZh', label: '中文标题' },
        { show: true, edit: true, minWidth: 300, key: 'nameZhPinyin', label: '中文标题拼音' },
        { show: true, edit: true, minWidth: 300, key: 'def', label: '英文简介' },
        { show: true, edit: true, minWidth: 300, key: 'defZh', label: '英文简介' },
        { show: true, edit: true, minWidth: 300, key: 'alias', label: '别名' },
        { show: true, edit: true, minWidth: 300, key: 'channel', label: '分类' },
        { show: true, edit: true, minWidth: 300, key: 'oldtopic', label: '原topic' },
        { show: true, edit: true, minWidth: 300, key: 'updateTime', label: '更新时间' },
        { show: true, edit: true, minWidth: 300, key: 'isPublic', label: '是否发布' },
        { show: true, edit: true, minWidth: 300, key: 'like', label: '历史更新时间记录' },
        { show: true, edit: true, minWidth: 300, key: 'numLike', label: '更新次数' },
        { show: true, edit: true, minWidth: 300, key: 'mustReading', label: '必读推荐' },
        { show: true, edit: true, minWidth: 300, key: 'mustReadingCount', label: '必读推荐数量' },
        { show: true, edit: true, minWidth: 300, key: 'numView', label: '阅读次数' },
        { show: true, edit: true, minWidth: 300, key: 'citationCount', label: '引用次数' },
        { show: true, edit: true, minWidth: 300, key: 'pdfCount', label: 'pdf数量' },
        { show: true, edit: true, minWidth: 300, key: 'pptCount', label: 'ppt数量' },
        { show: true, edit: true, minWidth: 300, key: 'statsTotal', label: '统计数量' },
        { show: true, edit: true, minWidth: 300, key: 'statsUpdatedTime', label: '统计时间' }
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

