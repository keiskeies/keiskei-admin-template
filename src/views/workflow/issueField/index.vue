<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueField" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueField" ></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueField',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'name', label: '名称', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'WORD',tooltip: ''},
          {key: 'type', label: '类型', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'DICTIONARY',optionKey: 'issueFieldTypeOptions', tooltip: ''},
          {key: 'nickName', label: '别名', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'WORD',tooltip: ''},
          {key: 'describe', label: '描述', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'LONG_WORD',tooltip: ''},
          {key: 'items', label: '选项', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:"TREE_MULTI_SELECT",optionKey: 'issueFieldItemOptions', tooltip: ''},
        ],
        format: {
          type: (data, index) => {return (options.issueFieldTypeOptions.find(e => e.id === data.type) || {name: ''}).name},
          items: (data, index) => {return data.map(e => e.name).join(',')},
        },
        rules: {
          add: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            type: [{required: true, message: '类型不能为空', trigger: 'blur'},],
            nickName: [],
            describe: [{required: true, message: '描述不能为空', trigger: 'change'},],
            items: [],
          },
          edit: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            type: [{required: true, message: '类型不能为空', trigger: 'blur'},],
            nickName: [],
            describe: [{required: true, message: '描述不能为空', trigger: 'change'},],
            items: [],
          }
        },
        options: {
          issueFieldTypeOptions: [
            {id: 'WORD', name: '单行文字', type: 'info', effect: 'dark'},
            {id: 'LONG_WORD', name: '段落', type: 'info', effect: 'dark'},
            {id: 'HTML', name: '富文本', type: 'info', effect: 'dark'},
            {id: 'DATE', name: '日期', type: 'info', effect: 'dark'},
            {id: 'TIME', name: '时间', type: 'info', effect: 'dark'},
            {id: 'DATE_TIME', name: '日期时间', type: 'info', effect: 'dark'},
            {id: 'SELECT', name: '单选', type: 'info', effect: 'dark'},
            {id: 'MULTI_SELECT', name: '多选', type: 'info', effect: 'dark'},
            {id: 'USER_SELECT', name: '用户单选', type: 'info', effect: 'dark'},
            {id: 'USER_MULTI_SELECT', name: '用户多选', type: 'info', effect: 'dark'},
            {id: 'NUMBER', name: '整数', type: 'info', effect: 'dark'},
            {id: 'DECIMAL', name: '小数', type: 'info', effect: 'dark'},
            {id: 'TREE_SELECT', name: '树形单选', type: 'info', effect: 'dark'},
            {id: 'TREE_MULTI_SELECT', name: '树形多选', type: 'info', effect: 'dark'},
            {id: 'TAGS', name: '标签', type: 'info', effect: 'dark'},
          ],
          issueFieldItemOptions: [],
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

