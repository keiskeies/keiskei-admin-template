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
        :actions-width="360"
        actions-align="left"
        edit-page
        @reloadOptions="handleGetOptions"
      >
        <template slot="raw_actions" slot-scope="scope">
          <el-button
            v-waves
            style="margin-left: 10px"
            type="success"
            @click="handleBuildProject(scope.row.id)"
          >构建
          </el-button>
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

export default {
  name: 'ProjectInfo',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: false, minWidth: 300, key: 'name', label: '项目名称' },
        { show: true, edit: false, width: 200, key: 'version', label: '版本号' },
        { show: true, edit: false, width: 200, key: 'favicon', label: 'favicon', type: 'IMAGE' },
        { show: true, edit: false, width: 200, key: 'logo', label: 'LOGO', type: 'IMAGE' },
        { show: true, edit: false, width: 200, key: 'author', label: '作者' }
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

    },
    handleBuildProject(id) {
      requestBase({
        url: '/generate/project/' + id + '/build',
        method: 'POST'
      }).then(res => {
        this.$notify.success(res.msg || '正在构建')
      })
    }
  }
}
</script>

