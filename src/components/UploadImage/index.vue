<template>
  <div class="upload-image-content">
    <el-upload class="avatar-uploader" :action="requestData.requestUrl" :headers="requestData.headerToken"
               accept=".jpg,.jpeg,.png,.gif" :on-progress="uploadImageProcess" :show-file-list="false"
               :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="fileUrl && !imageUploadFlag"
           :src="$media + fileUrl + '?x-oss-process=image/resize,w_315'" class="avatar"
           style="max-width: 100%;background-color: #000000">
      <el-progress v-if="imageUploadFlag" type="circle" :percentage="imageUploadPercent"
                   class="upload_border upload_press"></el-progress>
      <i v-if="!imageUploadFlag && !fileUrl" class="el-icon-plus avatar-uploader-icon upload_border"></i>
    </el-upload>
    <span v-if="promptSize">尺寸:{{ promptSize }}</span>
    <i class="el-icon-connection icon-btn" v-if="fileUrl && setPublic" @click="handlePublic">设为公用</i>
    <i class="el-icon-zoom-in  icon-btn" v-if="fileUrl" @click="dialogVisible=true">预览</i>
    <i class="el-icon-delete icon-btn" v-if="fileUrl" @click="handleVideoRemove">删除</i>
    <el-dialog :visible.sync="dialogVisible" destroy-on-close :modal="false">
      <img v-if="fileUrl" :src="$media + fileUrl" width="100%"
           style="background-color: #000000"/>
    </el-dialog>
  </div>
</template>
<script>
import {getToken} from '@/utils/auth'

export default {
  name: 'UploadImage',
  data() {
    return {
      requestData: {
        requestUrl: process.env.VUE_APP_BASE_API + '/common/file/upload',
        headerToken: {'Auth-Token': getToken()}
      },
      dialogVisible: false,
      fullscreenLoading: false,
      imageUploadPercent: undefined,
      imageUploadFlag: false,
      fileUrlTemp: undefined
    }
  },
  props: {
    fileUrl: {type: String, required: false, default: undefined},
    promptSize: {type: String, required: false, default: ''},
    disabledStatus: {type: Boolean, required: false, default: false},
    index: {type: Number, required: false, default: 0},
    columnName: {type: String, required: false, default: ''},
    setPublic: {type: Boolean, required: false, default: false}
  },
  methods: {
    //验证图片格式以及图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      this.imageUploadFlag = true
      if (this.fileUrl) {
        this.fileUrlTemp = this.fileUrl
      }
      return true
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      if (!res.code) {
        this.imageUploadFlag = false
        this.$emit('uploadSuccess', res.data.url, this.index, this.columnName)
      } else {
        this.imageUploadFlag = false
        this.$emit('uploadSuccess', this.fileUrlTemp, this.index, this.columnName)

      }
      this.imageUploadFlag = false
    },
    handleVideoRemove() {
      this.imageUploadFlag = false
      this.$emit('uploadSuccess', '', this.index, this.columnName)
    },
    handlePublic() {
      this.$emit('uploadSuccess', this.fileUrl, null, this.columnName)
    },
    uploadImageProcess(event, file, fileList) {
      this.imageUploadFlag = true
      this.imageUploadPercent = file.percentage ? file.percentage.toFixed(0) - 1 : 0
    }
  }
}
</script>
<style lang="scss">
@import "index.scss";
</style>


