<template>
  <div class="app-container">
    <div class="table-container">
      <base-list ref="table" url="/system/user" :options="options" :columns="columns" :format="format" :rules="rules"
                 @reloadOptions="handleGetOptions" permission="system:user"></base-list>
    </div>
  </div>
</template>

<script>
import {getBaseList, getBaseDetail, getBaseOptions, addBase, editBase, deleteBase} from '@/api/common'
import BaseList from '@/components/BaseList'

export default {
  name: 'SysUser',
  components: {BaseList},
  data() {
    return {
      columns: [
        {show: true, edit: true, queryFlag: true, sortable: false, width: 200, key: 'username', label: '账号', tooltip: '登陆用户名'},
        {show: true, edit: true, queryFlag: true, sortable: false, width: 200, key: 'name', label: '姓名', tooltip: '真实姓名'},
        {
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'MULTI_SELECT',
          optionKey: 'roleOptions',
          key: 'roles',
          label: '用户角色'
        },
        {
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 350,
          type: 'TREE_SELECT',
          optionKey: 'departmentOptions',
          key: 'department',
          label: '所属部门'
        },
        {
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 100,
          type: 'STATUS',
          key: 'enabled',
          label: '启用状态'
        },
        {
          show: true,
          edit: true,
          queryFlag: false,
          sortable: false,
          width: 200,
          type: 'IMAGE',
          key: 'avatar',
          label: '用户头像'
        },
        {show: true, edit: true, queryFlag: true, sortable: false, width: 200, key: 'phone', label: '用户手机号'},
        {
          show: true,
          edit: true,
          queryFlag: true,
          sortable: false,
          width: 200,
          type: 'EMAIL',
          key: 'email',
          label: '用户邮箱'
        },
        {
          show: false,
          edit: false,
          queryFlag: true,
          sortable: true,
          width: 200,
          type: 'DATE_TIME',
          key: 'createTime',
          label: '创建时间'
        },
      ],
      format: {},
      rules: {
        add: {
          username: [{required: true, message: '账号必填!', trigger: 'blur'}],
          name: [{required: true, message: '姓名必填!', trigger: 'blur'}],
          status: [{required: true, message: '启用状态必填!', trigger: 'change'}],
          phone: [{required: true, message: '用户手机号必填!', trigger: 'blur'}],
          email: [{required: true, message: '用户邮箱必填!', trigger: 'blur'}],
        },
        edit: {
          username: [{required: true, message: '账号必填!', trigger: 'blur'}],
          name: [{required: true, message: '姓名必填!', trigger: 'blur'}],
          status: [{required: true, message: '启用状态必填!', trigger: 'change'}],
          phone: [{required: true, message: '用户手机号必填!', trigger: 'blur'}],
          email: [{required: true, message: '用户邮箱必填!', trigger: 'blur'}],
        },
      },
      options: {
        roleOptions: [],
        departmentOptions: []
      },
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
      getBaseOptions('/system/role', {}).then(res => {
        this.options.roleOptions = res.data
      })
      getBaseList('/system/department', {}).then(res => {
        this.options.departmentOptions = res.data
      })
    }
  }
}
</script>

