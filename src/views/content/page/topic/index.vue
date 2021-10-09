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
        :id-column="'id'"
        permission="content:page:topic"
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import { requestBase } from '@/api/common'
import BaseList from '@/components/BaseList'

export default {
  name: 'PageTopic',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'name', label: '英文标题', type: 'WORD' },
        { show: true, edit: true, minWidth: 300, key: 'nameZh', label: '中文标题', type: 'WORD' },
        { show: false, edit: true, minWidth: 300, key: 'nameZhPinyin', label: '中文标题拼音', type: 'WORD' },
        { show: false, edit: true, minWidth: 300, key: 'def', label: '英文简介', type: 'LONG_TEXT' },
        { show: false, edit: true, minWidth: 300, key: 'defZh', label: '中文简介', type: 'LONG_TEXT' },
        { show: true, edit: true, minWidth: 300, key: 'alias', label: '别名', type: 'WORD' },
        { show: false, edit: true, minWidth: 300, key: 'papers', label: 'papers', type: 'TAGS' },
        { show: true, edit: true, minWidth: 100, key: 'channel', label: '分类', type: 'WORD' },
        { show: true, edit: true, minWidth: 300, key: 'oldtopic', label: '原topic' },
        { show: true, edit: true, minWidth: 100, key: 'isPublic', label: '是否发布', type: 'BOOLEAN' },
        { show: true, edit: true, minWidth: 200, key: 'like', label: '历史更新时间记录' },
        { show: true, edit: true, minWidth: 100, key: 'numLike', label: '更新次数', type: 'NUMBER' },
        { show: false, edit: true, minWidth: 300, key: 'author', label: 'author', type: 'ARRAY' },
        { show: true, edit: true, minWidth: 100, key: 'mustReadingCount', label: '必读推荐数量' },
        { show: true, edit: true, minWidth: 100, key: 'numView', label: '阅读次数' },
        { show: true, edit: true, minWidth: 100, key: 'citationCount', label: '引用次数', type: 'NUMBER' },
        { show: true, edit: true, minWidth: 100, key: 'pdfCount', label: 'pdf数量', type: 'NUMBER' },
        { show: true, edit: true, minWidth: 100, key: 'pptCount', label: 'ppt数量', type: 'NUMBER' },
        { show: true, edit: true, minWidth: 100, key: 'statsTotal', label: '统计数量', type: 'NUMBER' },
        { show: true, edit: true, minWidth: 200, key: 'statsUpdatedTime', label: '统计时间', type: 'DATE_TIME' },
        { show: true, edit: true, minWidth: 200, key: 'updateTime', label: '更新时间', type: 'DATE_TIME' }
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
        paperOptions: []
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
      // requestBase({
      //   url: '/content/page/dataset/paper/options',
      //   method: 'GET',
      //   params: { show: 'id,title' }
      // }).then(res => {
      //   this.options.paperOptions = res.data
      // })
    }
  }
}
</script>

