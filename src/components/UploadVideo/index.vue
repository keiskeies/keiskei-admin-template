<template>
  <div class="upload-video-content">
    <el-upload
      class="avatar-uploader"
      multiple
      action
      accept=".mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb"
      :http-request="handleUploadRequest"
      :show-file-list="false"
    >
      <!--      <img style="max-height:180px;max-width: 367px;" v-if="fileUrl && !videoUploadFlag" :src="fileUrl + '?x-oss-process=video/snapshot,t_1000,h_180,m_fast,f_jpg'"/>-->
      <video
        v-if="fileUrl && !videoUploadFlag"
        style="max-height:180px;max-width: 367px;"
        :src="fileUrl"
        controls="controls"
      />
      <el-progress
        v-if="videoUploadFlag"
        type="circle"
        :percentage="videoUploadPercent"
        class="upload_border upload_press"
      />
      <i v-if="!videoUploadFlag && !fileUrl" class="el-icon-plus avatar-uploader-icon upload_border" />
    </el-upload>
    <i v-if="fileUrl && setPublic" class="el-icon-connection  icon-btn" @click="handlePublic">设为公用</i>
    <i v-if="fileUrl" class="el-icon-zoom-in  icon-btn" @click="dialogVisible=true">预览</i>
    <i v-if="fileUrl" class="el-icon-delete icon-btn" @click="handleVideoRemove">删除</i>
    <el-dialog :visible.sync="dialogVisible" destroy-on-close :modal="false">
      <video v-if="dialogVisible" :src="fileUrl" width="100%" controls="controls" />
    </el-dialog>
  </div>

</template>
<script>
import { uploadByPieces } from '@/utils/upload'

export default {
  name: 'UploadVideo',
  props: {
    fileUrl: { type: String, required: false, default: '' },
    index: { type: String, required: false, default: '' },
    columnName: { type: String, required: false, default: '' },
    setPublic: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      dialogVisible: false, // 预览弹框
      fullscreenLoading: false,
      videoUploadPercent: 0,
      videoUploadFlag: false,
      fileUrlTemp: undefined
    }
  },
  methods: {
    handleUploadRequest(back) {
      if (this.fileUrl) {
        this.fileUrlTemp = this.fileUrl
      }
      this.videoUploadFlag = true
      this.videoUploadPercent = 0
      uploadByPieces({
        file: back.file,
        progress: (num) => {
          this.videoUploadPercent = num
        },
        success: (data) => {
          this.$emit('columnValChange', data.data.url, this.index, this.columnName)
          this.videoUploadFlag = false
        },
        error: (e) => {
          if (this.fileUrlTemp) {
            this.$emit('columnValChange', this.fileUrlTemp, this.index, this.columnName)
          }
          this.videoUploadFlag = false
          this.videoUploadPercent = 0
        }
      })
    },
    handlePublic() {
      this.$emit('columnValChange', this.fileUrl, null, this.columnName)
    },
    handleVideoRemove() {
      this.$emit('columnValChange', '', this.index, this.columnName)
    }
  }
}
</script>
<style lang="scss" rel="”stylesheet/scss”">
@import "index.scss";
</style>

