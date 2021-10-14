<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueOperateLog" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueOperateLog" ></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueOperateLog',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'type', label: '操作类型', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:'DICTIONARY',optionKey: 'issueOperateLogTypeOptions', tooltip: ''},
          {key: 'issueField', label: '操作字段', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:"SELECT",optionKey: 'issueFieldOptions', tooltip: ''},
          {key: 'oldValue', label: '修改前', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'LONG_WORD',tooltip: ''},
          {key: 'newValue', label: '修改后', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'LONG_WORD',tooltip: ''},
        ],
        format: {
          type: (data, index) => {return (options.issueOperateLogTypeOptions.find(e => e.id === data.type) || {name: ''}).name},
          issueField: (data, index) => {return data.name},
        },
        rules: {
          add: {
            type: [],
            issueField: [],
            oldValue: [{required: true, message: '修改前不能为空', trigger: 'change'},],
            newValue: [{required: true, message: '修改后不能为空', trigger: 'change'},],
          },
          edit: {
            type: [],
            issueField: [],
            oldValue: [{required: true, message: '修改前不能为空', trigger: 'change'},],
            newValue: [{required: true, message: '修改后不能为空', trigger: 'change'},],
          }
        },
        options: {
          issueOperateLogTypeOptions: [
            {id: 'UPDATE', name: '修改', type: 'warning', effect: 'dark'},
            {id: 'ADD', name: '新增', type: 'success', effect: 'dark'},
          ],
          issueFieldOptions: [],
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
        getBaseOptions('/workflow/issueField',{}).then(res => {
          self.options.issueFieldOptions = res.data
        })
      }
    }
  }
</script>

