<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/content/page/article"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="content:page:article"
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
  name: 'PageArticle',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'title', label: '标题', type: 'WORD' },
        { show: true, edit: true, minWidth: 100, key: 'author', label: '作者', type: 'WORD' },
        { show: true, edit: true, minWidth: 200, key: 'image', label: '图片', type: 'IMAGE' },
        { show: true, edit: true, minWidth: 100, key: 'classify', label: '分类', type: 'DICTIONARY', optionKey: 'classifyOptions' },
        { show: true, edit: true, minWidth: 100, key: 'keywords', label: '关键词', type: 'TAGS' },
        { show: true, edit: true, minWidth: 100, key: 'isTop', label: '置顶', type: 'BOOLEAN' },
        { show: true, edit: true, minWidth: 100, key: 'isDownload', label: '可下载', type: 'BOOLEAN' },
        { show: true, edit: true, minWidth: 100, key: 'isDraft', label: '草稿', type: 'BOOLEAN' },
        { show: true, edit: false, minWidth: 100, key: 'view', label: '浏览次数', type: 'NUMBER' },
        { show: true, edit: false, minWidth: 100, key: 'share', label: '分享次数', type: 'NUMBER' },
        { show: true, edit: false, minWidth: 100, key: 'like', label: '修改次数', type: 'NUMBER' },
        { show: true, edit: true, minWidth: 300, key: 'pdfname', label: 'pdf名称', type: 'LONG_WORD' },
        { show: true, edit: true, minWidth: 300, key: 'wxlink', label: '微信链接', type: 'LONG_WORD' },
        { show: true, edit: true, minWidth: 300, key: 'wxshow', label: '微信SHOW', type: 'LONG_WORD' },
        { show: true, edit: true, minWidth: 300, key: 'abstract_', label: '简介', type: 'LONG_WORD' },
        { show: true, edit: false, minWidth: 200, key: 'createdTime', label: '创建时间', type: 'DATE_TIME' },
        { show: true, edit: false, minWidth: 200, key: 'updateTime', label: '更新时间', type: 'DATE_TIME' },
        { show: false, edit: true, minWidth: 300, key: 'raw', label: 'raw', type: 'OBJECT' }
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
        classifyOptions: [
          { id: '资讯', name: '资讯', type: 'success' },
          { id: '问答', name: '问答', type: 'warning' },
          { id: '解读', name: '解读', type: 'info' },
          { id: '文章', name: '文章', type: 'primary' }
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
      this.options = JSON.parse(localStorage.getItem('allOptions')) || this.options
    }
  }
}
</script>

