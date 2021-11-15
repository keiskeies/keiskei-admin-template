<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" v-model="value" class="tinymce-textarea" />
<!--    <div class="editor-custom-btn-container">-->
<!--      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />-->
<!--    </div>-->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.user.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { requestBase } from '@/api/common'
import { uploadByPieces } from '@/utils/upload'

// why use this cdn, detail see https://user.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  // components: { editorImage },
  props: {
    index: {
      type: Number,
      default: function() {
        return parseInt(Math.random() * 1000)
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    columnName: {
      type: String,
      default: 'content'
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 600
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: 'vue-tinymce-' + this.index,
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/file/upload',
      videoUploadPercent: 0,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'propmt',
        powerpaste_html_import: 'propmt',
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('columnValChange', editor.getContent(), this.index, this.columnName)
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        // 整合七牛上传
        images_dataimg_filter(img) {
          setTimeout(() => {
            const $image = $(img)
            $image.removeAttr('width')
            $image.removeAttr('height')
            if ($image[0].height && $image[0].width) {
              $image.attr('data-wscntype', 'image')
              $image.attr('data-wscnh', $image[0].height)
              $image.attr('data-wscnw', $image[0].width)
              $image.addClass('wscnph')
            }
          }, 0)
          return img
        },
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0)
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          requestBase({
            url: '/common/file/upload',
            method: 'POST',
            data: formData
          }).then(res => {
            success(res.data.url)
            progress(100)
          })
        },
        file_picker_types: 'media',
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'media') {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.onchange = function() {
              this.videoUploadPercent = 0
              const file = input.files[0]
              console.log(file)
              uploadByPieces({
                file: file,
                progress: (num) => {
                  this.videoUploadPercent = num
                },
                success: (data) => {
                  callback(data.data.url, { title: file.name })
                },
                error: (e) => {
                  console.error(e)
                }
              })
            }
            input.click()
          }
        },
        // media_url_resolver: function(data, resolve) {
        //   console.log('---------', data, resolve)
        //   try {
        //     const videoUri = encodeURI(data.url)
        //     const embedHtml =
        //       `<p>
        //          <span
        //             data-mce-selected="1"
        //             data-mce-object="video"
        //             data-mce-p-controls="controls"
        //             data-mce-p-controlslist="nodownload"
        //             data-mce-p-allowfullscreen="true"
        //             data-mce-p-src=${videoUri} >
        //             <video src=${data.url} width="100%" height="100%" controls="controls" autoplay="true" loop="loop" controlslist="nodownload">
        //             </video>
        //           </span>
        //         </p>
        //         <p style="text-align: left;"></p>`
        //     resolve({ html: embedHtml })
        //   } catch (e) {
        //     resolve({ html: '' })
        //   }
        // }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      console.log('==========', arr)
      arr.forEach(v => {
        if (v.url.toLowerCase().endsWith('.mp4')) {
          window.tinymce.get(this.tinymceId).insertContent(
            `<p>
              <span
                data-mce-selected="1"
                data-mce-object="video"
                data-mce-p-controls="controls"
                data-mce-p-controlslist="nodownload"
                data-mce-p-allowfullscreen="true"
                data-mce-p-src=${v.url} >
                  <video src=${v.url} width="100%" height="100%" controls="controls"  autoplay="true" loop="loop" controlslist="nodownload">
                  </video>
                </span>
              </p>
              <p style="text-align: left;"></p>`
          )
        } else {
          window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        }
      })

      //
      // if (type === 'video') {
      //   arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`'<video class="wscnph" src="${v.url}" autoplay="true" loop="loop"/>'`))
      // } else {
      //   arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-commen: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
