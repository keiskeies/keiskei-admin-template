<template>
  <div class="app-container">
    <div class="table-container">
      <el-form ref="dataForm" :rules="rules" :model="user" label-width="100px">
        <el-form-item label="账号:" prop="number">
          <el-input v-model="username"  class="form-item" disabled />
        </el-form-item>
        <el-form-item label="原始密码:" prop="password">
          <el-input v-model="user.password"  class="form-item" type="password" />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input v-model="user.newPassword"  class="form-item" type="password" />
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input v-model="user.confirmPassword"  class="form-item" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button  @click="onCancel">取消</el-button>
          <el-button  type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updatePassword } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'PersonalCenter',
  data() {
    return {
      rules: {
        realName: [{ required: true, message: '用户名不能为空!', trigger: 'blur' }],
        password: [{ required: true, message: '旧密码不能为空!', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空!', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '确定密码不能为空!', trigger: 'blur' }]
      },
      user: {
        username: undefined, // 账号
        realName: undefined, // 用户姓名
        password: undefined, // 原始密码
        newPassword: undefined, // 新密码
        confirmPassword: undefined // 确定密码
      }
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.user.username = this.username
  },
  methods: {
    onSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.user.password.length < 6 || this.user.newPassword.length < 6 || this.user.confirmPassword.length < 6) {
            this.$message({ message: '密码长度不能小6位数', type: 'warning' })
            return
          }
          if (this.user.newPassword !== this.user.confirmPassword) {
            this.$message({ message: '新密码与确定密码不一致', type: 'warning' })
            return
          }
          this.updateUserPassword()
        }
      })
    },
    onCancel() {
      window.history.back()
    },
    // 修改密码
    updateUserPassword() {
      const self = this
      updatePassword(this.user).then(res => {
        if (!res.code) {
          self.$notify.success('修改成功')
          setTimeout(() => {
            self.dispatchLogout()
          }, 1000)
        }
      })
    },
    async dispatchLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

