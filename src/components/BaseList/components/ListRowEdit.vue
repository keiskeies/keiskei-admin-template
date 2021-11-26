<template>
  <div>
    <el-form
      ref="tempDataForm"
      v-loading="drawerLoading"
      :rules="rules[drawerOptions[drawerStatus].value]"
      :model="temp"
      label-width="auto"
      label-suffix=": "
      style="margin: 15px;"
    >
      <el-form-item v-if="treeTable" label="上级" prop="parentId">
        <el-select v-model="temp.parentId" class="form-item">
          <el-option v-for="(item, index) in parentOptions" :key="index" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(column, index) in columns"
        v-if="column.edit"
        :key="index"
        :label="column.label"
        :prop="column.key"
      >
        <!--     图片     -->
        <template v-if="column.type === 'IMAGE'">
          <upload-image
            :ref="url + '_UploadImage_' + column.key"
            class="form-item"
            :file-url="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
        </template>
        <!--     视频     -->
        <template v-else-if="column.type === 'VIDEO'">
          <upload-video
            :ref="url + '_UploadVideo_' + column.key"
            class="form-item"
            :file-url="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
        </template>
        <!--     开关     -->
        <template v-else-if="column.type === 'ENABLE'">
          <el-switch
            v-model="temp[column.key]"
            active-color="#13ce66"
            inactive-color="#ff0000"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
        <!--     是否     -->
        <template v-else-if="column.type === 'BOOLEAN'">
          <el-switch
            v-model="temp[column.key]"
            active-color="#13ce66"
            inactive-color="#ff0000"
            active-text="是"
            inactive-text="否"
          />
        </template>
        <!--     数字     -->
        <template v-else-if="column.type === 'NUMBER'">
          <el-input-number
            v-model="temp[column.key]"
            class="form-item"
          />
        </template>
        <!--     多选     -->
        <template v-else-if="column.type === 'MULTI_SELECT'">
          <el-select
            v-model="temp[column.key]"
            class="form-item"
            value-key="id"
            multiple
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item[column.optionKeyLabel || 'name']"
              :value="item"
            />
          </el-select>
        </template>
        <!--     关联单选     -->
        <template v-else-if="column.type === 'REL_SELECT'">
          <el-select
            v-model="temp[column.key]"
            class="form-item"
            value-key="id"
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item[column.optionKeyLabel || 'name']"
              :value="item"
            />
          </el-select>
        </template>
        <!--    单选      -->
        <template v-else-if="column.type === 'DICTIONARY'">
          <el-select
            v-model="temp[column.key]"
            class="form-item"
            clearable
          >
            <el-option
              v-for="(item, index_) in options[column.optionKey]"
              :key="index_"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
        <!--     树形多选       -->
        <template v-else-if="column.type === 'TREE_MULTI_SELECT'">
          <tree-multi-select
            :ref="url + '_TreeForm_' + column.key"
            :column-name="column.key"
            :tree-data="options[column.optionKey]"
            :show-checkbox="drawerStatus > 1"
            :default-checked-keys="(temp[column.key]||[]).map(e => e.id)"
            @columnValChange="columnValChange"
          />
        </template>
        <!--          富文本-->
        <template v-else-if="column.type === 'HTML' || column.type === 'LONG_TEXT'">
          <tinymce
            :ref="url + '_Html_' + column.key"
            :value="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
        </template>
        <!--          LONG_WORD-->
        <template v-else-if="column.type === 'LONG_WORD'">
          <el-input
            v-model="temp[column.key]"
            type="textarea"
            :rows="5"
            :placeholder="'请输入' + column.label"
          />
        </template>
        <!--     树形单选       -->
        <template v-else-if="column.type === 'TREE_SELECT'">
          <tree-single-select
            :options="options[column.optionKey]"
            :check-node="temp[column.key]"
            :column-name="column.key"
            @columnValChange="columnValChange"
          />
        </template>
        <!--            时间日期-->
        <template v-else-if="column.type === 'DATE_TIME'">
          <el-date-picker
            v-model="temp[column.key]"
            clearable
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="form-item"
          />
        </template>
        <!--            时间日期-->
        <template v-else-if="column.type === 'DATE'">
          <el-date-picker
            v-model="temp[column.key]"
            clearable
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            class="form-item"
          />
        </template>
        <!--            时间日期-->
        <template v-else-if="column.type === 'TIME'">
          <el-time-picker
            v-model="temp[column.key]"
            clearable
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            type="time"
            class="form-item"
          />
        </template>
        <!--          标签-->
        <template v-else-if="column.type === 'TAGS'">
          <el-tag
            v-for="(tag, index_) in temp[column.key]"
            :key="index_"
            closable
            :disable-transitions="false"
            @close="handleClose(column.key, tag, index_)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible[column.key]"
            :ref="'saveTagInput_' + column.key"
            v-model="inputValue"
            class="form-item"
            @keyup.enter.native="handleInputConfirm(column.key)"
          />
          <el-button v-else class="button-new-tag" @click="showInput(column.key)">+ 添加</el-button>
        </template>
        <!--          Object-->
        <template v-else-if="column.type === 'OBJECT'">
          <vue-json-editor
            v-model="temp[column.key]"
            :mode="'code'"
            lang="zh"
          />
        </template>
        <!--          Array-->
        <template v-else-if="column.type === 'ARRAY'">
          <template v-for="arrayItem in temp[column.key]">
            <vue-json-editor
              :value="arrayItem"
              :mode="'code'"
              lang="zh"
            />
          </template>
        </template>
        <!--    普通文本      -->
        <template v-else>
          <el-input v-model="temp[column.key]" clearable :autofocus="column.autofocus"/>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="drawerStatus === 3"
          v-waves
          v-permission="[permission+':add']"
          type="primary"
          :loading="addOrEditLoading"
          @click="handleSave()"
        >保存
        </el-button>
        <el-button
          v-if="drawerStatus === 2"
          v-waves
          v-permission="[permission+':edit']"
          type="primary"
          :loading="addOrEditLoading"
          @click="handleUpdate()"
        >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import waves from '@/directive/waves'
import UploadImage from '@/components/UploadImage'
import UploadVideo from '@/components/UploadVideo'
import Tinymce from '@/components/Tinymce'
import TreeMultiSelect from '@/components/TreeMultiSelect'
import TreeSingleSelect from '@/components/TreeSingleSelect'
import VueJsonEditor from 'vue-json-editor'
import {addBase, editBase} from "@/api/common";

export default {
  name: 'ListRowEdit',
  components: {
    UploadImage,
    UploadVideo,
    Tinymce,
    TreeMultiSelect,
    TreeSingleSelect,
    VueJsonEditor,
  },
  directives: { permission, waves },
  props: {
    temp: {type: Object, default: () => {}},
    url: {type: String, default: ''},
    permission: { type: String, default: '' },
    columns: { type: Array, default: () => [] },
    parentOptions: { type: Array, default: () => [] },
    drawerStatus: {type: Number, default: 3},
    treeTable: { type: Boolean, default: false },
    rules: {
      type: Object, default: () => {
      }
    },
    options: {
      type: Object, default: () => {
      }
    },

  },
  data() {
    return {
      drawerLoading: false,
      inputVisible: {},
      inputValue: '',
      addOrEditLoading: false,
      drawerOptions: [
        { value: '', title: '' },
        { value: 'detail', title: '详情' },
        { value: 'edit', title: '编辑' },
        { value: 'add', title: '新建' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.tempDataForm.clearValidate()
    })
  },
  methods: {
    handleClose(key, tag, index) {
      this.temp[key].splice(index, 1)
    },
    showInput(key) {
      this.$set(this.inputVisible, key, true)
    },
    handleInputConfirm(key) {
      if (this.inputValue) {
        if (!this.temp[key]) {
          this.$set(this.temp, key, [undefined])
        }
        this.temp[key].push(this.inputValue)
      }
      this.$set(this.inputVisible, key, false)
      this.inputValue = ''
    },
    handleSave() {
      this.addOrEditLoading = true
      this.$refs.tempDataForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addBase(this.url, tempData).then(() => {
            this.$emit('fetchData')
            this.$emit('handleGetParentOptions')
            this.drawerVisible = false
            this.$notify.success('创建成功!')
            this.addOrEditLoading = false
          }).catch(() => {
            this.addOrEditLoading = false
          })
        } else {
          this.addOrEditLoading = false
        }
      })
    },
    handleUpdate() {
      this.addOrEditLoading = true
      this.$refs.tempDataForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editBase(this.url, tempData).then(() => {
            this.$emit('fetchData')
            this.$emit('handleGetParentOptions')
            this.drawerVisible = false
            this.$notify.success('修改成功!')
            this.addOrEditLoading = false
          }).catch(() => {
            this.addOrEditLoading = false
          })
        } else {
          this.addOrEditLoading = false
        }
      })
    },
    columnValChange(val, index, column) {
      this.$set(this.temp, column, val)
    }
  }
}
</script>

<style scoped>

</style>
