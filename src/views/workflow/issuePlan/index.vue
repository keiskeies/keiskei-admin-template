<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issuePlan" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issuePlan" treeTable></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssuePlan',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'parentId', label: '上级数据', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'TREE_SELECT',tooltip: '', optionKey: 'issuePlanOptions'},
          {key: 'name', label: '计划名称', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'WORD',tooltip: ''},
          {key: 'startDate', label: '开始时间', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'DATE',tooltip: ''},
          {key: 'endDate', label: '结束时间', show: false, edit: true, queryFlag: true, sortable: false, width: 200,type:'DATE',tooltip: ''},
          {key: 'remark', label: '备注', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'LONG_WORD',tooltip: ''},
        ],
        format: {
        },
        rules: {
          add: {
            name: [{required: true, message: '计划名称不能为空', trigger: 'change'},],
            startDate: [{required: true, message: '开始时间不能为空', trigger: 'blur'},],
            endDate: [{required: true, message: '结束时间不能为空', trigger: 'blur'},],
            remark: [],
          },
          edit: {
            name: [{required: true, message: '计划名称不能为空', trigger: 'change'},],
            startDate: [{required: true, message: '开始时间不能为空', trigger: 'blur'},],
            endDate: [{required: true, message: '结束时间不能为空', trigger: 'blur'},],
            remark: [],
          }
        },
        options: {
          issuePlanOptions: []
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
      }
    }
  }
</script>

