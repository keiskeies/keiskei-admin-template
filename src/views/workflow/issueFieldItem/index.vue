<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueFieldItem" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueFieldItem" treeTable></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueFieldItem',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'parentId', label: '上级数据', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'TREE_SELECT',tooltip: '', optionKey: 'issueFieldItemOptions'},
          {key: 'value', label: '字段值', show: false, edit: true, queryFlag: true, sortable: false, width: 300,type:'WORD',tooltip: ''},
        ],
        format: {
        },
        rules: {
          add: {
            value: [{required: true, message: '字段值不能为空', trigger: 'change'},],
          },
          edit: {
            value: [{required: true, message: '字段值不能为空', trigger: 'change'},],
          }
        },
        options: {
          issueFieldItemOptions: []
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
        getBaseOptions('/workflow/issueFieldItem',{}).then(res => {
          self.options.issueFieldItemOptions = res.data
        })
      }
    }
  }
</script>

