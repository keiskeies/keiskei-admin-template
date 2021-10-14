<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueFieldValue" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueFieldValue" ></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueFieldValue',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'field', label: '卡片字段', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:"SELECT",optionKey: 'issueFieldOptions', tooltip: ''},
          {key: 'value', label: '卡片字段值', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:'TAG',tooltip: ''},
        ],
        format: {
          field: (data, index) => {return data.name},
        },
        rules: {
          add: {
            field: [],
            value: [],
          },
          edit: {
            field: [],
            value: [],
          }
        },
        options: {
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

