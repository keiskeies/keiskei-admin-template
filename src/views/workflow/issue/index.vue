<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issue" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issue" treeTable></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssue',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'parentId', label: '上级数据', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'TREE_SELECT',tooltip: '', optionKey: 'issueOptions'},
          {key: 'title', label: '标题', show: false, edit: true, queryFlag: true, sortable: false, width: 300,type:'WORD',tooltip: ''},
          {key: 'plan', label: '所属计划', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:"TREE_SELECT",optionKey: 'issuePlanOptions', tooltip: ''},
          {key: 'reviews', label: '评论', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:"TREE_MULTI_SELECT",optionKey: 'issueReviewOptions', tooltip: ''},
          {key: 'operateLogs', label: '操作记录', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:"MULTI_SELECT",optionKey: 'issueOperateLogOptions', tooltip: ''},
          {key: 'attachments', label: '附件', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:"MULTI_SELECT",optionKey: 'issueAttachmentOptions', tooltip: ''},
          {key: 'type', label: '卡片类型', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:"SELECT",optionKey: 'issueTypeOptions', tooltip: ''},
          {key: 'fieldValues', label: '字段值', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:"MULTI_SELECT",optionKey: 'issueFieldValueOptions', tooltip: ''},
        ],
        format: {
          plan: (data, index) => {return data.name},
          reviews: (data, index) => {return data.map(e => e.name).join(',')},
          operateLogs: (data, index) => {return data.map(e => e.name).join(',')},
          attachments: (data, index) => {return data.map(e => e.name).join(',')},
          type: (data, index) => {return data.name},
          fieldValues: (data, index) => {return data.map(e => e.name).join(',')},
        },
        rules: {
          add: {
            title: [{required: true, message: '标题不能为空', trigger: 'change'},],
            plan: [],
            reviews: [],
            operateLogs: [],
            attachments: [{required: true, message: '附件不能为空', trigger: 'blur'},],
            type: [{required: true, message: '卡片类型不能为空', trigger: 'blur'},],
            fieldValues: [],
          },
          edit: {
            title: [{required: true, message: '标题不能为空', trigger: 'change'},],
            plan: [],
            reviews: [],
            operateLogs: [],
            attachments: [{required: true, message: '附件不能为空', trigger: 'blur'},],
            type: [{required: true, message: '卡片类型不能为空', trigger: 'blur'},],
            fieldValues: [],
          }
        },
        options: {
          issuePlanOptions: [],
          issueReviewOptions: [],
          issueOperateLogOptions: [],
          issueAttachmentOptions: [],
          issueTypeOptions: [],
          issueFieldValueOptions: [],
          issueOptions: []
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
        const options = JSON.parse(localStorage.getItem('allOptions'))
        if (options) {
          this.options = Object.assign(this.options, options)
        }
        const self = this
        getBaseOptions('/workflow/issuePlan',{}).then(res => {
          self.options.issuePlanOptions = res.data
        })
        getBaseOptions('/workflow/issueReview',{}).then(res => {
          self.options.issueReviewOptions = res.data
        })
        getBaseOptions('/workflow/issueOperateLog',{}).then(res => {
          self.options.issueOperateLogOptions = res.data
        })
        getBaseOptions('/workflow/issueAttachment',{}).then(res => {
          self.options.issueAttachmentOptions = res.data
        })
        getBaseOptions('/workflow/issueType',{}).then(res => {
          self.options.issueTypeOptions = res.data
        })
        getBaseOptions('/workflow/issueFieldValue',{}).then(res => {
          self.options.issueFieldValueOptions = res.data
        })
        getBaseOptions('/workflow/issue',{}).then(res => {
          self.options.issueOptions = res.data
        })
      }
    }
  }
</script>

