<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ realName }} Welcome</div>
    <!-- <h2 style="font-family: webfont;">这里是阿里字体</h2>
    <h2 style="font-family: webfont2;">这里是阿里字体</h2>
    <h2>默认字体</h2> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'realName'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
