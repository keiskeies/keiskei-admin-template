<template>
  <div class="upload-video-content">
    <el-upload class="avatar-uploader" multiple action
               accept=".mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb"
               :http-request="handleUploadRequest" :show-file-list="false"
    >
<!--      <img style="max-height:180px;max-width: 367px;" v-if="fileUrl && !videoUploadFlag" :src="fileUrl + '?x-oss-process=video/snapshot,t_1000,h_180,m_fast,f_jpg'"/>-->
      <video style="max-height:180px;max-width: 367px;" v-if="fileUrl && !videoUploadFlag" :src="fileUrl" controls="controls"></video>
      <el-progress v-if="videoUploadFlag" type="circle" :percentage="videoUploadPercent"
                   class="upload_border upload_press"></el-progress>
      <i v-if="!videoUploadFlag && !fileUrl" class="el-icon-plus avatar-uploader-icon upload_border"></i>
    </el-upload>
    <i class="el-icon-connection  icon-btn" v-if="fileUrl && setPublic" @click="handlePublic">设为公用</i>
    <i class="el-icon-zoom-in  icon-btn" v-if="fileUrl" @click="dialogVisible=true">预览</i>
    <i class="el-icon-delete icon-btn" v-if="fileUrl" @click="handleVideoRemove">删除</i>
    <el-dialog :visible.sync="dialogVisible" destroy-on-close  :modal="false">
      <video v-if="dialogVisible" :src="fileUrl" width="100%" controls="controls"></video>
    </el-dialog>
  </div>

</template>
<script>
  import { uploadByPieces } from '@/utils/upload'

  export default {
    name: 'UploadVideo',
    data() {
      return {
        dialogVisible: false,//预览弹框
        fullscreenLoading: false,
        videoUploadPercent: 0,
        videoUploadFlag: false,
        fileUrlTemp: undefined,
      }
    },
    props: {
      fileUrl: { type: String, required: false, default: '' },
      index: { type: String, required: false, default: '' },
      columnName: { type: String, required: false, default: '' },
      setPublic: { type: Boolean, required: false, default: false },
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
            this.$emit('uploadSuccess', data.data.url, this.index, this.columnName)
            this.videoUploadFlag = false
          },
          error: (e) => {
            if (this.fileUrlTemp) {
              this.$emit('uploadSuccess', this.fileUrlTemp, this.index, this.columnName)
            }
            this.videoUploadFlag = false
            this.videoUploadPercent = 0
          }
        })
      },
      handlePublic() {
        this.$emit('uploadSuccess', this.fileUrl, null, this.columnName)
      },
      handleVideoRemove() {
        this.$emit('uploadSuccess', '', this.index, this.columnName)
      }
    }
  }
</script>
<style lang="scss" rel=”stylesheet/scss”>
  @import "index.scss";
</style>


