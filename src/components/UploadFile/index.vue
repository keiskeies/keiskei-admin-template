<template>
  <div class="upload-file-content">
    <el-upload class="upload-demo" :action="requestData.requestUrl" :headers="requestData.headerToken" accept=".pdf, .zip, .rar, .xls, .docx" multiple :file-list="fileList" :on-remove="handleRemove" :limit="1" :on-success="handleFileSuccess">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">*只限pdf，zip格式，rar格式,xls格式,docx格式</div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { tokenKey } from '@/settings'
export default {
  name: 'UploadFile',
  props: {
    fileList: {
      type: Array, default: () => [
      ]
    }
  },
  data() {
    return {
      requestData: {
        requestUrl: process.env.VUE_APP_BASE_API + '/common/file/upload',
        headerToken: {}
      }
    }
  },
  created() {
    this.headerToken[tokenKey] = getToken()
  },
  methods: {
    handleExceed(files, fileList) {
      //   this.$message.warning(
      //     `当前限制选择 3 个文件，本次选择了 ${
      //       files.length
      //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      //   );
    },
    handleRemove(file, fileList) {
      if (file.status == 'success') {
        this.$emit('deleteSuccess', fileList)
      }
    },
    // 文件上传成功
    handleFileSuccess(res, file) {
      if (!res.code) {
        this.$emit('uploadSuccess', { url: res.data.url, fileName: file.name })
      } else {
        console.log(res.message)
      }
    }
  }
}
</script>
<style lang="scss">
.upload-file-content {
  .el-upload-list {
    // .el-upload-list__item-status-label {
    //   display: none !important;
    // }
    // .el-upload-list__item {
    //   .el-icon-close {
    //     display: none !important;
    //   }
    //   .el-icon-close-tip {
    //     display: none;
    //   }
    //   .el-icon-close:hover {
    //     display: none !important;
    //   }
    // }
  }
  .upload-demo {
    .el-upload__tip {
      display: inline;
      margin-left: 20px;
    }
    .el-upload-list {
      margin-left: 80px;
    }
  }
}
</style>

