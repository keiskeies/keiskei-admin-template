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
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'keywords', label: '关键词' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'title', label: '标题' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'author', label: '作者' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'image', label: '图片' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'isTop', label: '是否置顶' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'isDownload', label: '是否可下载' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'isDraft', label: '是否草稿' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'createTime', label: '创建时间' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'updateTime', label: '更新时间' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'view', label: '浏览次数' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'share', label: '分享次数' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'like', label: '修改次数' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'pdfname', label: 'pdf名称' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'wxlink', label: '微信链接' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'wxshow', label: '微信链接' },
        { show: true, edit: true, queryFlag: true, sortable: false, minWidth: 300, key: 'classify', label: '分类' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'abstract_', label: '简介' },
        { show: true, edit: true, queryFlag: false, sortable: false, minWidth: 300, key: 'raw', label: 'raw' }
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

