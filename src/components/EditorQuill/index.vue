<template>
  <div class="editor-quill-content" :style="{backgroundColor:bgdColor}">
    <div style="display: none">
      <el-upload class="video-upload"
                 accept=".mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb"
                 :format="['mp4','qlv','qsv','ogg','flv','avi','wmv','rmvb']"
                 multiple
                 :action="requestData.uploadUrl"
                 :http-request="handleUploadRequest"
                 :headers="requestData.headerToken"
                 :show-file-list="false"
      >
        <el-button :class="'video-upload-btn'+index" icon="ios-cloud-upload-outline" type="primary"></el-button>
      </el-upload>
    </div>
    <br>
    <div>选择源码: <el-switch v-model="codeFlag" active-color="#13ce66" inactive-color="#ff4949"> </el-switch></div>
    <br>
    <div v-if="codeFlag"><el-input type="textarea" placeholder="请输入带标签的源码" :rows="20" v-model="editorContext" @change="onTextareaChange"></el-input></div>
    <div v-else><quill-editor  ref="myQuillEditor" :value="editorContext" :options="editorOption" @change="onEditorChange($event)" ></quill-editor></div>
    <br>
    <div style="width: 100%;text-align: center"><el-button v-waves @click="createDialogVisible = true">预览</el-button></div>

    <el-dialog title="预览" :visible.sync="createDialogVisible" :width="$store.state.app.device === 'mobile' ? '100%' : '80%'" destroy-on-close :modal="false">
      <div class="ql-editor" v-html="editorContext" ></div>
    </el-dialog>


  </div>
</template>
<script>
import {quillEditor, Quill} from "vue-quill-editor";
import {container, ImageExtend, QuillWatch} from "quill-image-extend-module";
import waves from '@/directive/waves' // waves directive
import {getToken} from "@/utils/auth";
import {uploadByPieces} from '@/utils/upload'
import uploadImage from "@/components/UploadImage";
import permission from "@/directive/permission";

Quill.register("modules/ImageExtend", ImageExtend);
const Video = Quill.import('formats/video')

class VideoBlot extends Video {
  static create(value) {
    const node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('autoplay', 'true')
    node.setAttribute('loop', 'loop')
    node.setAttribute('style', 'width: 100%;height: auto;');
    node.setAttribute('webkit-playsinline', true)
    node.setAttribute('playsinline', true)
    node.setAttribute('x5-playsinline', true)

    return node
  }

  static value(node) {

    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
    }
  }
}

VideoBlot.blotName = 'video'
VideoBlot.tagName = 'video'
Quill.register(VideoBlot)
export default {
  name: "EditorQuill",
  components: {
    uploadImage
  },
  directives: { waves },
  data() {
    return {
      createDialogVisible: false,
      codeFlag: false,
      requestData: {
        uploadUrl: process.env.VUE_APP_BASE_API + "/common/file/upload",
        headerToken: {"Auth-Token": getToken()}
      },
      editorOption: {
        modules: {
          ImageExtend: {
            size: 10, // 可选参数 图片大小，单位为M，1M = 1024kb
            name: "file",
            headers: xhr => {
              xhr.setRequestHeader("Auth-Token", getToken());
              xhr.setRequestHeader("FileSign", getToken());
              return xhr;
            },
            action: process.env.VUE_APP_BASE_API + "/common/file/upload",
            response: res => {
              const fileUrl = res.data.url
              return (fileUrl.indexOf('//') < 0 ? this.$media : '') + fileUrl
            },
            progress(pro) {
              pro = '[' + 'uploading' + pro / 2 + ']'
              QuillWatch.active.quill.root.innerHTML
                = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, pro)
            }
          },
          //配置工具栏的工具（可挑选自己所需工具使用）
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'direction': 'rtl'}],
              [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              [{'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']}],
              [{'align': []}],
              ['clean'],
              ['link', 'image', 'video']
            ],
            handlers: {
              // 劫持原来的图片点击按钮事件
              image: function (value) {
                QuillWatch.emit(this.quill.id)
              },
              video: function (value) {
                if (value) {
                  // 调用 upload-image图片上传
                  document.querySelector(".video-upload .video-upload-btn" + this.index).click();
                } else {
                  this.quill.format("video", false);
                }
              }
            }
          }
        },
        // 改变提示文字内容
        placeholder: "请输入内容...",
      }
    };
  },
  props: {
    editorContext: {
      type: String,
      default: ""
    },
    bgdColor: {
      type: String,
      default: "#fff"
    },
    index: {
      type: String,
      required: false,
      default: ''
    },
    columnName: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted() {
    // this.editor();
  },

  methods: {
    onTextareaChange(html) {
      this.$emit("textHtmlChange", html, this.index, this.columnName);
    },
    onEditorChange({quill, html, text}) {
      this.$emit("textHtmlChange", html, this.index, this.columnName);
    },
    handleUploadRequest(back) {
      let quill = this.$refs.myQuillEditor.quill;
      let length = quill.getSelection().index;
      quill.insertText(length, '[uploadVideo...]', true)
      uploadByPieces({
        file: back.fi,
        progress: (num) => {
          num = '[' + 'uploadVideo' + num + '%]'
          quill.root.innerHTML
            = quill.root.innerHTML.replace(/\[uploadVideo.*?\]/, num)
        },
        success: (data) => {
          quill.root.innerHTML
            = quill.root.innerHTML.replace(/\[uploadVideo.*?\]/, '<video src="' + data.data.url + '" style="width: 100%;height: auto;" autoplay="true" loop="loop"/>')
          // 调整光标到最后
          quill.setSelection(length + 1);
        },
        error: (e) => {
          quill.root.innerHTML
            = quill.root.innerHTML.replace(/\[uploadVideo.*?\]/, '[upload error]')
        }
      })
    }
  }
};
</script>
<style>
@import "../../styles/font-family.css";
</style>
<style lang="scss">
.editor-quill-content {
  line-height: 1.15;

  .quill-editor {
    font-size: 14px;
    font-family: SourceHanSansCN;
    color: rgba(145, 150, 153, 1);

    .ql-container {
      height: 300px;
    }
  }
}
</style>

