<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueReview" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueReview" treeTable></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueReview',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'parentId', label: '上级数据', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'TREE_SELECT',tooltip: '', optionKey: 'issueReviewOptions'},
          {key: 'content', label: '内容', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:'WORD',tooltip: ''},
        ],
        format: {
        },
        rules: {
          add: {
            content: [{required: true, message: '内容不能为空', trigger: 'change'},],
          },
          edit: {
            content: [{required: true, message: '内容不能为空', trigger: 'change'},],
          }
        },
        options: {
          issueReviewOptions: []
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
        getBaseOptions('/workflow/issueReview',{}).then(res => {
          self.options.issueReviewOptions = res.data
        })
      }
    }
  }
</script>

