<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/email/pushRecord"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="email:pushRecord"
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
import { requestBase } from '@/api/common'
import BaseList from '@/components/BaseList'

export default {
  name: 'PushRecord',
  components: { BaseList },
  directives: { permission, waves },
  data() {
    return {
      columns: [
        { show: true, edit: true, minWidth: 300, key: 'subject', label: '邮件主题', type: 'WORD' },
        { show: true, edit: true, width: 200, key: 'toUser', label: '发送人账号', type: 'WORD' },
        { show: true, edit: true, width: 200, key: 'status', label: '状态', type: 'DICTIONARY', optionKey: 'pushStatusOptions' },
        { show: true, edit: true, width: 200, key: 'pushTask', label: '所属任务', type: 'REL_SELECT', optionKey: 'pushTaskOptions', optionKeyLabel: 'subject' },
        { show: true, edit: true, width: 200, key: 'sentDate', label: '发送时间' }
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
        pushTaskOptions: [],
        permissionOptions: [],
        pushStatusOptions: [
          { id: 'SUCCESS', name: '成功', type: 'success' },
          { id: 'FAIL', name: '失败', type: 'danger' }
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
      requestBase({
        url: '/email/pushTask/options',
        method: 'GET'
      }).then(res => {
        this.options.pushTaskOptions = res.data
      })
    }
  }
}
</script>

