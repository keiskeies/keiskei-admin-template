<template>
  <div class="user-corner">
    <el-row :gutter="20">
      <el-col :span="4"><div class="grid-content bg-purple">
        <img :src="(avatar && avatar.indexOf('//')<0 ? $media : '') + avatar + '?x-oss-process=image/resize,w_100,h_100'" class="user-avatar" alt="">
      </div></el-col>
      <el-col :span="16"><div class="grid-content bg-purple">
        <p>
          {{ name }}，欢迎您！
        </p>
      </div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">
        <el-button type="primary" icon="el-icon-message" circle />
      </div></el-col>
    </el-row>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserCorner',
  computed: {
    ...mapGetters(['name', 'username', 'phone', 'email', 'avatar', 'roles'])
  }
}
</script>

<style lang="scss" scoped>
.user-corner {
  text-align: center;
  .user-avatar{
    height: 40px;
    width: 40px;
    border-radius: 40px;
    display: block;
  }
}
</style>
