<template>
  <div class="app-container" style="margin-right: 20px">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="userInfo" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>信息修改</span>
            </div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本资料" name="first">
                <el-form ref="infoDataForm" :rules="infoRule" :model="userInfo" label-width="120px" label-suffix=": ">
                  <el-form-item label="头像">
                    <upload-image class="form-item" :ref="'avatar'" @uploadSuccess="mediaChange" :fileUrl="userInfo.avatar" columnName="avatar"></upload-image>
                  </el-form-item>
                  <el-form-item label="姓名" prop="realName">
                    <el-input clearable class="form-item" v-model="userInfo.realName" placeholder="真实姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input clearable class="form-item" v-model="userInfo.phone" placeholder="手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input clearable class="form-item" v-model="userInfo.email" placeholder="邮箱"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button  type="primary" @click="handleUpdateSelfInfo">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="second">
                <el-form ref="passwordDataForm" :rules="passwordRule" :model="user" label-width="120px" label-suffix=": ">
                  <el-form-item label="原始密码" prop="password">
                    <el-input v-model="user.password"  class="form-item" type="password" />
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="user.newPassword"  class="form-item" type="password" />
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="user.confirmPassword"  class="form-item" type="password" />
                  </el-form-item>
                  <el-form-item>
                    <el-button  type="primary" @click="resetSelfPassword">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword, update as updateSelfInfo } from '@/api/user'
import UserCard from './components/UserCard'
import UploadImage from '@/components/UploadImage/index'

export default {
  name: 'Profile',
  components: { UserCard, UploadImage },
  data() {
    return {
      infoRule: {
        realName: [{ required: true, message: '请输入姓名!', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号!', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱!', trigger: 'blur' }],
      },
      passwordRule: {
        password: [{ required: true, message: '旧密码不能为空!', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空!', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '确定密码不能为空!', trigger: 'blur' }]
      },
      activeName: 'first',
      temp: {},
      userInfo: {
        realName: undefined,
        username: undefined,
        phone: undefined,
        email: undefined,
        avatar: undefined,
        roles: undefined
      },
      user: {
        password: undefined, // 原始密码
        newPassword: undefined, // 新密码
        confirmPassword: undefined // 确定密码
      },
    }
  },
  computed: {
    ...mapGetters(['realName', 'username', 'phone', 'email', 'avatar', 'roles'])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.userInfo.realName = this.realName
      this.userInfo.username = this.username
      this.userInfo.phone = this.phone
      this.userInfo.email = this.email
      this.userInfo.avatar = this.avatar
      this.userInfo.roles = this.roles.join('，')
    },
    resetSelfPassword() {
      const self = this
      self.$refs['passwordDataForm'].validate(valid => {
        if (valid) {
          if (self.user.password.length < 6 || self.user.newPassword.length < 6 || self.user.confirmPassword.length < 6) {
            self.$message({ message: '密码长度不能小6位数', type: 'warning' })
            return
          }
          if (self.user.newPassword !== self.user.confirmPassword) {
            self.$message({ message: '新密码与确定密码不一致', type: 'warning' })
            return
          }
          updatePassword(self.user).then(res => {
            self.$notify.success('修改成功')
            setTimeout(() => {
              self.dispatchLogout()
            }, 1000)
          })
        }
      })
    },
    handleUpdateSelfInfo() {
      this.$refs['infoDataForm'].validate(valid => {
        if (valid) {
          updateSelfInfo(this.userInfo).then(res => {
            this.$notify.success('修改成功')
          })
        }
      })
    },
    mediaChange(val, index, column) {
      this.userInfo[column] = val;
    },
    async dispatchLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
