<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/email/pushTask"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        :actions-width="360"
        actions-align="left"
        permission="email:pushTask"
        @reloadOptions="handleGetOptions"
      >
        <template slot="raw_actions" slot-scope="scope">
          <el-popover placement="right" width="400" trigger="click">
            <el-upload
              class="upload-demo"
              :action="requestData.requestUrl.format({pushTaskId: scope.row.id})"
              :headers="requestData.headerToken"
              accept=".xls,.svg,.xlsx"
              :on-error="handleImportFail"
              :drag="true"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-button slot="reference" v-waves style="margin-left: 10px" icon="el-icon-upload2" type="success" plain>导入收件人
            </el-button>
          </el-popover>
          <el-button
            v-if="!scope.row.status || scope.row.status === 'NONE'"
            v-waves
            style="margin-left: 10px"
            type="success"
            @click="handleSendStart(scope.row.id)"
          >发送
          </el-button>
          <el-button
            v-if="scope.row.status && scope.row.status === 'STARTING'"
            v-waves
            style="margin-left: 10px"
            type="danger"
            @click="handleSendStop(scope.row.id)"
          >暂停
          </el-button>
        </template>
      </base-list>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import BaseList from '@/components/BaseList'
import { getBaseOptions, requestBase } from '@/api/common'
import { getToken } from '@/utils/auth'

export default {
  name: 'PushTask',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      requestData: {
        requestUrl: process.env.VUE_APP_BASE_API + '/email/pushTask/{pushTaskId}/toUsers/import',
        headerToken: { 'Access-Token': getToken() }
      },
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'subject', label: '邮件主题' },
        { show: true, edit: true, width: 200, key: 'purpose', label: '推送目的' },
        { show: true, edit: true, width: 200, key: 'sentDate', label: '发送时间' },
        { show: true, edit: true, width: 200, key: 'type', label: '推送类型', type: 'DICTIONARY', optionKey: 'pushTypeOptions' },
        { show: false, edit: true, width: 200, key: 'template', label: '推送模版', type: 'REL_SELECT', optionKey: 'pushTemplateOptions' },
        { show: true, edit: true, width: 200, key: 'status', label: '状态', type: 'DICTIONARY', optionKey: 'pushStatusOptions' },
        { show: true, edit: false, width: 200, key: 'expectation', label: '预期效果' },
        { show: true, edit: false, width: 200, key: 'pushNum', label: '实际推送量' },
        { show: true, edit: false, width: 200, key: 'clickNum', label: '实际点击率' },
        { show: false, edit: true, width: 200, key: 'toUsers', label: '接收人', type: 'TAGS' },
        { show: true, edit: false, width: 200, key: 'user', label: '操作者' }
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
        pushTemplateOptions: [],
        pushTypeOptions: [
          { id: 'FIXATION', name: '固定', type: 'success' },
          { id: 'DYNAMIC', name: '动态', type: 'danger' }
        ],
        pushStatusOptions: [
          { id: 'NONE', name: '', type: 'success' },
          { id: 'STARTING', name: '已开始', type: 'success' },
          { id: 'STOP', name: '已停止', type: 'danger' },
          { id: 'FINISH', name: '已结束', type: 'info' }
        ]
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
      getBaseOptions('/email/pushTemplate', { conditions: JSON.stringify({}), show: 'id,name' }).then(res => {
        this.options.pushTemplateOptions = res.data
      })
    },
    handleSendStart(id) {
      requestBase({
        url: '/email/pushTask/' + id + '/send/start',
        method: 'PATCH'
      }).then(res => {
        this.$notify.success('正在发送!')
      })
    },
    handleSendStop(id) {
      requestBase({
        url: '/email/pushTask/' + id + '/send/stop',
        method: 'PATCH'
      }).then(res => {
        this.$notify.success('发送暂停!')
      })
    },
    handleImportFail(err, file, fileList) {
      const msg = JSON.parse(err.toString().substring(6).trim()).msg
      this.$notify.error({
        title: '错误提示',
        message: msg,
        duration: 0
      })
    }
  }
}
</script>

