<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/workflow/issueAttachment" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="workflow:issueAttachment" ></base-list>
    </div>
  </div>
</template>

<script>
  import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
  import BaseList from '@/components/BaseList'

  export default {
    name: 'WorkflowIssueAttachment',
    components: {BaseList},
    data() {
      return {
        columns: [
          {key: 'name', label: '名称', show: false, edit: true, queryFlag: false, sortable: false, width: 200,type:'WORD',tooltip: ''},
          {key: 'link', label: '连接', show: false, edit: false, queryFlag: false, sortable: false, width: 200,type:'LONG_WORD',tooltip: ''},
        ],
        format: {
        },
        rules: {
          add: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            link: [],
          },
          edit: {
            name: [{required: true, message: '名称不能为空', trigger: 'change'},],
            link: [],
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
        const options = JSON.parse(localStorage.getItem('allOptions'))
        if (options) {
          this.options = Object.assign(this.options, options)
        }
        const self = this
      }
    }
  }
</script>

