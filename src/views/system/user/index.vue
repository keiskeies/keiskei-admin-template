<template>
  <div class="app-container">
    <div class="table-container">
      <base-list
        ref="table"
        url="/system/user"
        :options="options"
        :columns="columns"
        :format="format"
        :rules="rules"
        permission="system:user"
        @reloadOptions="handleGetOptions"
      />
    </div>
  </div>
</template>

<script>
import { getBaseList, getBaseOptions } from '@/api/common'
import BaseList from '@/components/BaseList'

export default {
  name: 'SysUser',
  components: { BaseList },
  data() {
    return {
      columns: [
        { show: true, edit: true, width: 200, key: 'username', label: '账号', tooltip: '登陆用户名', type: 'WORD' },
        { show: true, edit: true, width: 200, key: 'name', label: '姓名', tooltip: '真实姓名', type: 'WORD' },
        { show: true, edit: true, width: 200, type: 'MULTI_SELECT', optionKey: 'roleOptions', key: 'roles', label: '用户角色' },
        { show: true, edit: true, width: 350, type: 'TREE_SELECT', optionKey: 'departmentOptions', key: 'department', label: '所属部门' },
        { show: true, edit: true, width: 100, type: 'ENABLE', key: 'enabled', label: '启用状态' },
        { show: true, edit: true, width: 200, type: 'IMAGE', key: 'avatar', label: '用户头像' },
        { show: true, edit: true, width: 200, type: 'WORD', key: 'phone', label: '用户手机号' },
        { show: true, edit: true, width: 200, type: 'WORD', key: 'email', label: '用户邮箱' },
        { show: true, edit: true, width: 200, type: 'DATE_TIME', key: 'accountExpiredTime', label: '过期时间' }
      ],
      format: {},
      rules: {
        add: {
          username: [{ required: true, message: '账号必填!', trigger: 'blur' }],
          name: [{ required: true, message: '姓名必填!', trigger: 'blur' }],
          status: [{ required: true, message: '启用状态必填!', trigger: 'change' }],
          phone: [{ required: true, message: '用户手机号必填!', trigger: 'blur' }],
          email: [{ required: true, message: '用户邮箱必填!', trigger: 'blur' }]
        },
        edit: {
          username: [{ required: true, message: '账号必填!', trigger: 'blur' }],
          name: [{ required: true, message: '姓名必填!', trigger: 'blur' }],
          status: [{ required: true, message: '启用状态必填!', trigger: 'change' }],
          phone: [{ required: true, message: '用户手机号必填!', trigger: 'blur' }],
          email: [{ required: true, message: '用户邮箱必填!', trigger: 'blur' }]
        }
      },
      options: {
        roleOptions: [],
        departmentOptions: []
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
      getBaseOptions('/system/role', {}).then(res => {
        self.options.roleOptions = res.data
      })
      getBaseList('/system/department', {}).then(res => {
        self.options.departmentOptions = res.data
      })
    }
  }
}
</script>

