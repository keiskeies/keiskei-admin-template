`
<template>
  <el-form ref="dataForm" :inline="true" label-width="100px" label-suffix=": ">
    <div v-for="(items, index_) in columns" :key="index_" style="overflow: hidden">
      <p style="font-weight: bold;font-size: 20px;">{{ items.label }}</p>

      <el-form-item v-for="(item, index) in items.columns" :key="index" :label="item.label">
        <div class="form-item">
          <img v-if="item.type === 'image'" :src="(dataForm[item.key].indexOf('//')< 0 ? $media: '') + dataForm[item.key]" style="border: 1px solid #e0e0e0;border-radius: 5px">
          <div v-else-if="item.type === 'content'" class="ql-container ql-snow" style="border: 1px solid #efefef;">
            <div class="ql-editor" v-html="dataForm[item.key]" ></div>
          </div>
          <a v-else style="display: block;font-weight: bold;font-size: 14px;color: #2d2f33">
            {{
              format != null && typeof (format[item.key]) != 'undefined' ? format[item.key](dataForm, index) : dataForm[item.key] || '--'
            }}
          </a>
        </div>
      </el-form-item>
    </div>

  </el-form>
</template>
<script>
export default {
  name: 'FormDetail',
  props: {
    columns: {type: Array, default: () => []},
    format: {
      type: Object, default: () => {
      }
    },
    dataForm: {
      type: Object, default: () => {
      }
    },
  },
  watch: {}
}
</script>

<style scoped>

</style>
