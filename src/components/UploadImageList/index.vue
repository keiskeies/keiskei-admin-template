<template>
  <div class="upload-image-list-content">
    <el-upload
      accept=".jpg, .jpeg, .png"
      :action="requestData.requestUrl"
      list-type="picture-card"
      :headers="requestData.headerToken"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :multiple="multipleStatus"
      :file-list="imageList"
      :limit="limitNumber"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" destroy-on-close :modal="false">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    // 是否支持多选文件
    multipleStatus: { type: Boolean, default: true },
    // 最多上传的个数
    limitNumber: { type: Number, default: 3 },
    index: { type: String, required: false, default: '' },
    columnName: { type: String, required: false, default: '' },
    imageList: { type: Array, default: () => [] },
    // 是否验证图片
    beforeUpload: { type: Boolean, default: false }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      requestData: {
        requestUrl: process.env.VUE_APP_BASE_API + '/common/file/upload',
        headerToken: { 'Access-Token': getToken() }
      }
    }
  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      const data = []
      fileList.forEach(e => {
        data.push({ name: e.name, url: e.url })
      })
      this.$emit('columnValChange', data, this.index, this.columnName)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 验证图片格式以及图片大小
    beforeAvatarUpload(file) {
      if (!this.beforeUpload) {
        return true
      }
      const isJPG = file.type === 'image/jpeg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片只能是(jpg/png/jpeg)格式!')
        this.fullscreenLoading = false
        return false
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        this.fullscreenLoading = false
        return false
      }
      return true
    },
    // 图片上传成功
    handleAvatarSuccess(res, file, fileList) {
      if (!res.code) {
        const data = []
        fileList.forEach(e => {
          data.push(e.response ? { name: e.response.data.name, url: e.response.data.url } : { name: e.name, url: e.url })
        })
        this.$emit('columnValChange', data, this.index, this.columnName)
      } else {
        console.error(res.message)
      }
    }
  }
}
</script>
