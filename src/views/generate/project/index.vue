<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/generate/project"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="generate:project"
        edit-page
        edit-page-width="90%"
        @reloadOptions="handleGetOptions"
      >
        <template slot="raw_actions" slot-scope="scope">
          <el-button
            v-if="!scope.row.status || scope.row.status === 'NONE'"
            v-waves
            :loading="buildLoading"
            style="margin-left: 10px"
            type="success"
            @click="handleBuildStart(scope.row.id)"
          >创建
          </el-button>
        </template>
        <template slot="raw_edit" slot-scope="scope">
          <project-edit :id="scope.row.id"></project-edit>
        </template>
      </base-list>
    </div>
  </div>
</template>

<script>
import { requestBase } from '@/api/common'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'
import ProjectEdit from './edit'

export default {
  name: 'ProjectInfo',
  components: { BaseList, ProjectEdit },
  directives: { permission, waves },
  data() {
    return {
      buildLoading: false,
      columns: [
        { show: true, queryable: true, edit: false, minWidth: 300, key: 'name', label: '项目名称', type: 'WORD' },
        { show: true, queryable: true, edit: false, width: 200, key: 'version', label: '版本号', type: 'WORD' },
        { show: true, queryable: true, edit: false, width: 200, key: 'author', label: '作者', type: 'WORD' },
        { show: true, edit: false, width: 200, key: 'favicon', label: 'favicon', type: 'IMAGE' },
        { show: true, edit: false, width: 200, key: 'logo', label: 'LOGO', type: 'IMAGE' }
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
    },
    handleBuildStart(id) {
      this.buildLoading = true
      requestBase({
        url: '/generate/project/' + id + '/build',
        method: 'POST'
      }).then(res => {
        this.buildLoading = false
      }).catch(() => {
        this.buildLoading = false
      })
    }
  }
}
</script>

