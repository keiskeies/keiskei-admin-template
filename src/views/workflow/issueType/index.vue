<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueType" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueType" ></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueType',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'name', label: '名称', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'WORD',tooltip: ''},
          {key: 'color', label: '颜色', show: false, edit: true, queryFlag: false, sortable: false, width: 100,type:'WORD',tooltip: ''},
          {key: 'typeSource', label: '类型来源', show: false, edit: false, queryFlag: true, sortable: false, width: 150,type:'DICTIONARY',optionKey: 'issueTypeTypeSourceOptions', tooltip: ''},
          {key: 'describe', label: '描述', show: false, edit: true, queryFlag: true, sortable: false, width: 300,type:'DICTIONARY',optionKey: 'issueTypeDescribeOptions', tooltip: ''},
          {key: 'fields', label: '字段', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:"MULTI_SELECT",optionKey: 'issueFieldOptions', tooltip: ''},
        ],
        format: {
          typeSource: (data, index) => {return (options.issueTypeTypeSourceOptions.find(e => e.id === data.typeSource) || {name: ''}).name},
          describe: (data, index) => {return (options.issueTypeDescribeOptions.find(e => e.id === data.describe) || {name: ''}).name},
          fields: (data, index) => {return data.map(e => e.name).join(',')},
        },
        rules: {
          add: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            color: [],
            typeSource: [],
            describe: [],
            fields: [],
          },
          edit: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            color: [],
            typeSource: [],
            describe: [],
            fields: [],
          }
        },
        options: {
          issueTypeTypeSourceOptions: [
            {id: 'SYSTEM', name: '系统类型', type: 'info', effect: 'dark'},
            {id: 'CUSTOM', name: '自定义类型', type: 'success', effect: 'plain'},
          ],
          issueTypeDescribeOptions: [
            {id: '', name: '', type: 'info', effect: 'dark'},
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

