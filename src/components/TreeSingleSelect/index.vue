<template>
  <div>
    <el-cascader
      :ref="columnName + '_' + index"
      v-model="val"
      class="form-item"
      :options="options"
      :props="props"
      clearable
      filterable
      @change="handleTreeNodeClick"
    >
      <template slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>
<script>

export default {
  name: 'TreeSingleSelect',
  props: {
    props: { type: Object, required: false, default: () => { return { value: 'id', label: 'name', leaf: 'id', emitPath: false, checkStrictly: true } } },
    options: { type: Array, default: () => [] },
    index: { type: Number, required: false, default: 0 },
    columnName: { type: String, required: true, default: '' },
    checkNode: { type: Object, default: () => {} }
  },
  data: () => {
    return {
      val: undefined
    }
  },
  watch: {
    checkNode: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.val = newVal.id
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleTreeNodeClick(val) {
      // console.log(this.$refs[this.columnName + '_' + this.commen].getCheckedNodes()[0].data)
      this.$emit('columnValChange', { id: val }, this.index, this.columnName)
    }
  }
}
</script>
